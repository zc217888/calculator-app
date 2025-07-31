import { useState, useEffect, useCallback } from 'react'
import { CalculationHistory } from '../types/calculator'

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

  // 从服务器加载历史记录（简化版本）
  const loadServerHistory = useCallback(async () => {
    // 本地版本不需要从服务器加载
    console.log('使用本地历史记录')
  }, [])


  // 添加历史记录
  const addToHistory = useCallback(async (calculation: CalculationHistory) => {
    const newHistory = [calculation, ...history.slice(0, 99)]
    setHistory(newHistory)
    saveLocalHistory(newHistory)
  }, [history, saveLocalHistory])

  // 清除历史记录
  const clearHistory = useCallback(async () => {
    setHistory([])
    saveLocalHistory([])
  }, [saveLocalHistory])

  // 删除单条历史记录
  const deleteHistoryItem = useCallback(async (id: string) => {
    const newHistory = history.filter(item => item.id !== id)
    setHistory(newHistory)
    saveLocalHistory(newHistory)
  }, [history, saveLocalHistory])

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
    isLoading: false,
    error: null,
    addToHistory,
    clearHistory,
    loadHistory,
    deleteHistoryItem,
    syncWithServer,
    setSyncWithServer
  }
}