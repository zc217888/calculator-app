// API基础配置 - 现在只使用Vercel API路由
const API_BASE_URL = '/api'

// API响应接口
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp?: string
}

// 计算历史接口
interface CalculationHistory {
  id: string
  expression: string
  result: string
  timestamp: Date
}

// HTTP请求工具类
class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error: any) {
      console.error('API请求错误:', error)
      throw new Error(error.message || '网络请求失败')
    }
  }

  // GET请求
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  // POST请求
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // DELETE请求
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

// 创建API客户端实例
const apiClient = new ApiClient(API_BASE_URL)

// 计算器API服务
export const calculatorApi = {
  // 执行计算
  calculate: async (expression: string) => {
    return apiClient.post('/calculator/calculate', { expression })
  },

  // 验证表达式
  validate: async (expression: string) => {
    return apiClient.post('/calculator/validate', { expression })
  },

  // 获取支持的函数列表
  getFunctions: async () => {
    return apiClient.get('/calculator/functions')
  },
}

// 历史记录API服务
export const historyApi = {
  // 获取历史记录
  getHistory: async (limit = 50, offset = 0) => {
    return apiClient.get(`/history?limit=${limit}&offset=${offset}`)
  },

  // 添加历史记录
  addHistory: async (expression: string, result: string) => {
    return apiClient.post('/history', { expression, result })
  },

  // 删除指定历史记录
  deleteHistory: async (id: string) => {
    return apiClient.delete(`/history/${id}`)
  },

  // 清空所有历史记录
  clearHistory: async () => {
    return apiClient.delete('/history')
  },

  // 获取历史统计
  getStats: async () => {
    return apiClient.get('/history/stats')
  },
}

// 健康检查API
export const healthApi = {
  check: async () => {
    return apiClient.get('/health')
  },
}

// 导出类型
export type { ApiResponse, CalculationHistory }