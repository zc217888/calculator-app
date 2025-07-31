// API响应基础接口
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp?: string
}

// 计算请求接口
export interface CalculateRequest {
  expression: string
}

// 计算响应接口
export interface CalculateResponse {
  success: boolean
  expression: string
  result: string
  timestamp: string
}

// 历史记录接口
export interface HistoryItem {
  id: string
  expression: string
  result: string
  timestamp: Date
  userAgent?: string
}

// 历史记录列表响应接口
export interface HistoryListResponse {
  success: boolean
  data: HistoryItem[]
  total: number
  limit: number
  offset: number
}

// 历史记录统计接口
export interface HistoryStats {
  total: number
  today: number
  thisWeek: number
  thisMonth: number
  oldestRecord: Date | null
  newestRecord: Date | null
}

// 函数信息接口
export interface FunctionInfo {
  name: string
  description: string
  value?: number
}

// 支持的函数列表接口
export interface SupportedFunctions {
  basic: FunctionInfo[]
  scientific: FunctionInfo[]
  constants: FunctionInfo[]
}

// 错误响应接口
export interface ErrorResponse {
  error: string
  message: string
  expression?: string
}