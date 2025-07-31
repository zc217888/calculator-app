import React from 'react'
import { HistoryPanelProps } from '../types/calculator'

const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onClearHistory,
  isOpen,
  onClose,
  isLoading = false,
  syncWithServer = true,
  onToggleSync
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div className={`history-panel ${isOpen ? 'block' : 'hidden lg:block'}`}>
      {/* 面板头部 */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-slate-800">计算历史</h3>
          {isLoading && (
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {/* 同步设置 */}
          {onToggleSync && (
            <button
              onClick={() => onToggleSync(!syncWithServer)}
              className={`text-xs px-2 py-1 rounded transition-colors ${
                syncWithServer 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={syncWithServer ? '已启用服务器同步' : '已禁用服务器同步'}
            >
              {syncWithServer ? '🔄 同步' : '📱 本地'}
            </button>
          )}
          
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-sm text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors"
              title="清除所有历史记录"
              disabled={isLoading}
            >
              清除
            </button>
          )}
          <button
            onClick={onClose}
            className="lg:hidden text-slate-500 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition-colors"
            title="关闭历史面板"
          >
            ✕
          </button>
        </div>
      </div>

      {/* 历史记录列表 */}
      <div className="max-h-96 overflow-y-auto">
        {history.length === 0 ? (
          <div className="p-6 text-center text-slate-500">
            <div className="text-4xl mb-2">📝</div>
            <p>暂无计算历史</p>
            <p className="text-sm mt-1">开始计算后这里会显示历史记录</p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group"
                title="点击复制到计算器"
              >
                {/* 计算表达式 */}
                <div className="text-sm text-slate-600 mb-1 font-mono">
                  {item.expression}
                </div>
                
                {/* 计算结果 */}
                <div className="text-lg font-semibold text-slate-800 font-mono">
                  = {item.result}
                </div>
                
                {/* 时间戳 */}
                <div className="text-xs text-slate-400 mt-2 flex justify-between items-center">
                  <span>{formatTime(item.timestamp)}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600">
                    点击使用
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 面板底部统计 */}
      {history.length > 0 && (
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-center">
          <span className="text-sm text-slate-600">
            共 {history.length} 条记录
          </span>
        </div>
      )}
    </div>
  )
}

export default HistoryPanel