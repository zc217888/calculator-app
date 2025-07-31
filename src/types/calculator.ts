// 计算历史记录接口
export interface CalculationHistory {
  id: string
  expression: string
  result: string
  timestamp: Date
}

// 计算器状态接口
export interface CalculatorState {
  display: string
  expression: string
  previousValue: string
  operation: string | null
  waitingForNewValue: boolean
  isError: boolean
}

// 按钮类型
export type ButtonType = 'number' | 'operator' | 'special' | 'clear' | 'equals'

// 计算器按钮接口
export interface CalculatorButton {
  label: string
  value: string
  type: ButtonType
  className?: string
  colspan?: number
  scientific?: boolean
}

// 计算器组件属性接口
export interface CalculatorProps {
  isScientificMode: boolean
  onAddToHistory: (calculation: CalculationHistory) => void
  history: CalculationHistory[]
}

// 头部组件属性接口
export interface HeaderProps {
  isScientificMode: boolean
  onToggleScientific: () => void
  onToggleHistory: () => void
  historyCount: number
}

// 历史记录面板属性接口
export interface HistoryPanelProps {
  history: CalculationHistory[]
  onClearHistory: () => void
  isOpen: boolean
  onClose: () => void
  isLoading?: boolean
  syncWithServer?: boolean
  onToggleSync?: (sync: boolean) => void
}

// 显示屏组件属性接口
export interface DisplayProps {
  expression: string
  result: string
  isError: boolean
}
