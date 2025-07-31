import { useState, useEffect, useCallback } from 'react'
import { CalculationHistory } from '../types/calculator'
import { historyApi } from '../services/api'

interface UseHistoryReturn {
  history: CalculationHistory[]
  isLoading: boolean
  error: string | null
  addToHistory: (calculation: CalculationHistory) => Promise<void>
  clearHistory: () => Promise<void>
  loadHistory: () => Promise<void>
  deleteHistoryItem: (id: string) => Promise<void>
  syncWithServer: boolean
  setSyncWithServer: (sync: boolean) => void
}

export const useHistory = (): UseHistoryReturn => {
  const [history, setHistory] = useState<CalculationHistory[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [syncWithServer, setSyncWithServer] = useState(true)

  // 从本地存储加载历史记录
  const loadLocalHistory = useCallback(() => {
    try {
      const savedHistory = localStorage.getItem('calculator-history')
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory)
        const historyWithDates = parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }))
        setHistory(historyWithDates)
      }
    } catch (err) {
      console.error('加载本地历史记录失败:', err)
    }
  }, [])

  // 保存历史记录到本地存储
  const saveLocalHistory = useCallback((newHistory: CalculationHistory[]) => {
    try {
      localStorage.setItem('calculator-history', JSON.stringify(newHistory))
    } catch (err) {
      console.error('保存本地历史记录失败:', err)
    }
  }, [])

  // 从服务器加载历史记录
  const loadServerHistory = useCallback(async () => {
    if (!syncWithServer) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await historyApi.getHistory(50, 0)
      
      if (response.success && response.data) {
        const serverHistory = response.data.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }))
        
        // 合并本地和服务器历史记录，去重
        const mergedHistory = mergeHistories(history, serverHistory)
        setHistory(mergedHistory)
        saveLocalHistory(mergedHistory)
      }
    } catch (err: any) {
      console.error('加载服务器历史记录失败:', err)
      setError('无法连接到服务器，使用本地历史记录')
    } finally {
      setIsLoading(false)
    }
  }, [syncWithServer, history, saveLocalHistory])

  // 合并历史记录并去重
  const mergeHistories = (local: CalculationHistory[], server: CalculationHistory[]): CalculationHistory[] => {
    const combined = [...local, ...server]
    const unique = combined.filter((item, index, arr) => 
      arr.findIndex(other => other.id === item.id) === index
    )
    
    return unique
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 100) // 限制最多100条记录
  }

  // 添加历史记录
  const addToHistory = useCallback(async (calculation: CalculationHistory) => {
    const newHistory = [calculation, ...history.slice(0, 99)]
    setHistory(newHistory)
    saveLocalHistory(newHistory)

    // 同步到服务器
    if (syncWithServer) {
      try {
        await historyApi.addHistory(calculation.expression, calculation.result)
      } catch (err) {
        console.error('同步到服务器失败:', err)
        // 不影响本地操作
      }
    }
  }, [history, saveLocalHistory, syncWithServer])

  // 清除历史记录
  const clearHistory = useCallback(async () => {
    setHistory([])
    saveLocalHistory([])

    // 清除服务器历史记录
    if (syncWithServer) {
      try {
        await historyApi.clearHistory()
      } catch (err) {
        console.error('清除服务器历史记录失败:', err)
        setError('清除服务器历史记录失败')
      }
    }
  }, [saveLocalHistory, syncWithServer])

  // 删除单条历史记录
  const deleteHistoryItem = useCallback(async (id: string) => {
    const newHistory = history.filter(item => item.id !== id)
    setHistory(newHistory)
    saveLocalHistory(newHistory)

    // 从服务器删除
    if (syncWithServer) {
      try {
        await historyApi.deleteHistory(id)
      } catch (err) {
        console.error('从服务器删除历史记录失败:', err)
        // 不影响本地操作
      }
    }
  }, [history, saveLocalHistory, syncWithServer])

  // 加载历史记录
  const loadHistory = useCallback(async () => {
    loadLocalHistory()
    if (syncWithServer) {
      await loadServerHistory()
    }
  }, [loadLocalHistory, loadServerHistory, syncWithServer])

  // 组件挂载时加载历史记录
  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  // 监听同步设置变化
  useEffect(() => {
    if (syncWithServer && history.length === 0) {
      loadServerHistory()
    }
  }, [syncWithServer, loadServerHistory, history.length])

  return {
    history,
    isLoading,
    error,
    addToHistory,
    clearHistory,
    loadHistory,
    deleteHistoryItem,
    syncWithServer,
    setSyncWithServer
  }
}