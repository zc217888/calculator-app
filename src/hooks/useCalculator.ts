import { useState, useCallback } from 'react'
import { evaluate } from 'mathjs'
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
      const result = evaluate(expression)
      return String(result)
    } catch (err: any) {
      console.error('计算错误:', err)
      setError(err.message || '计算表达式无效')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [clearError])

  // 验证表达式
  const validateExpression = useCallback(async (expression: string): Promise<boolean> => {
    if (!expression.trim()) return false

    try {
      evaluate(expression)
      return true
    } catch (err) {
      console.error('验证错误:', err)
      return false
    }
  }, [])

  // 同步历史记录到服务器（简化版本）
  const syncHistoryToServer = useCallback(async (history: CalculationHistory): Promise<void> => {
    // 本地版本不需要同步到服务器
    console.log('历史记录已保存到本地:', history)
  }, [])

  // 从服务器加载历史记录（简化版本）
  const loadHistoryFromServer = useCallback(async (): Promise<CalculationHistory[]> => {
    // 本地版本返回空数组，由本地存储管理
    return []
  }, [])

  // 清除服务器历史记录（简化版本）
  const clearServerHistory = useCallback(async (): Promise<void> => {
    // 本地版本不需要清除服务器历史记录
    console.log('服务器历史记录清除（本地版本）')
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