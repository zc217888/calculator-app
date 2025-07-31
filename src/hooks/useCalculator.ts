import { useState, useCallback } from 'react'
import { calculatorApi, historyApi } from '../services/api'
import { CalculationHistory } from '../types/calculator'

interface UseCalculatorReturn {
  isLoading: boolean
  error: string | null
  calculateExpression: (expression: string) => Promise<string | null>
  validateExpression: (expression: string) => Promise<boolean>
  syncHistoryToServer: (history: CalculationHistory) => Promise<void>
  loadHistoryFromServer: () => Promise<CalculationHistory[]>
  clearServerHistory: () => Promise<void>
}

export const useCalculator = (): UseCalculatorReturn => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 清除错误状态
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // 计算表达式
  const calculateExpression = useCallback(async (expression: string): Promise<string | null> => {
    if (!expression.trim()) return null

    setIsLoading(true)
    clearError()

    try {
      const response = await calculatorApi.calculate(expression)
      
      if (response.success && response.data) {
        return response.data.result
      } else {
        setError(response.error || '计算失败')
        return null
      }
    } catch (err: any) {
      console.error('计算错误:', err)
      setError(err.message || '网络错误，使用本地计算')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [clearError])

  // 验证表达式
  const validateExpression = useCallback(async (expression: string): Promise<boolean> => {
    if (!expression.trim()) return false

    try {
      const response = await calculatorApi.validate(expression)
      return response.data?.valid || false
    } catch (err) {
      console.error('验证错误:', err)
      return false
    }
  }, [])

  // 同步历史记录到服务器
  const syncHistoryToServer = useCallback(async (history: CalculationHistory): Promise<void> => {
    try {
      await historyApi.addHistory(history.expression, history.result)
    } catch (err: any) {
      console.error('同步历史记录失败:', err)
      // 不抛出错误，允许本地历史记录继续工作
    }
  }, [])

  // 从服务器加载历史记录
  const loadHistoryFromServer = useCallback(async (): Promise<CalculationHistory[]> => {
    try {
      const response = await historyApi.getHistory(50, 0)
      
      if (response.success && response.data) {
        return response.data.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }))
      }
      
      return []
    } catch (err: any) {
      console.error('加载历史记录失败:', err)
      return []
    }
  }, [])

  // 清除服务器历史记录
  const clearServerHistory = useCallback(async (): Promise<void> => {
    try {
      await historyApi.clearHistory()
    } catch (err: any) {
      console.error('清除服务器历史记录失败:', err)
      setError('清除服务器历史记录失败')
    }
  }, [])

  return {
    isLoading,
    error,
    calculateExpression,
    validateExpression,
    syncHistoryToServer,
    loadHistoryFromServer,
    clearServerHistory
  }
}