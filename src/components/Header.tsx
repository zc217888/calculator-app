import React from 'react'
import { HeaderProps } from '../types/calculator'

const Header: React.FC<HeaderProps> = ({
  isScientificMode,
  onToggleScientific,
  onToggleHistory,
  historyCount
}) => {
  return (
    <header className="bg-primary-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* 左侧标题 */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🧮</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold">智能计算器</h1>
          </div>

          {/* 右侧控制按钮 */}
          <div className="flex items-center space-x-3">
            {/* 模式切换按钮 */}
            <button
              onClick={onToggleScientific}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isScientificMode
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              title={isScientificMode ? '切换到基础模式' : '切换到科学模式'}
            >
              {isScientificMode ? '科学' : '基础'}
            </button>

            {/* 历史记录按钮 */}
            <button
              onClick={onToggleHistory}
              className="relative px-4 py-2 rounded-lg font-medium bg-white/10 text-white hover:bg-white/20 transition-all duration-200"
              title="查看计算历史"
            >
              <span className="flex items-center space-x-2">
                <span>📋</span>
                <span className="hidden sm:inline">历史</span>
              </span>
              {historyCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {historyCount > 99 ? '99+' : historyCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header