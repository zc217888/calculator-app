import { useState } from 'react'
import Calculator from './components/Calculator'
import Header from './components/Header'
import HistoryPanel from './components/HistoryPanel'
import { useHistory } from './hooks/useHistory'

function App() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isScientificMode, setIsScientificMode] = useState(false)
  
  const {
    history,
    isLoading: historyLoading,
    error: historyError,
    addToHistory,
    clearHistory,
    syncWithServer,
    setSyncWithServer
  } = useHistory()

  const toggleHistoryPanel = () => {
    setIsHistoryOpen(!isHistoryOpen)
  }

  const toggleScientificMode = () => {
    setIsScientificMode(!isScientificMode)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header 
        isScientificMode={isScientificMode}
        onToggleScientific={toggleScientificMode}
        onToggleHistory={toggleHistoryPanel}
        historyCount={history.length}
      />
      
      {/* 错误提示 */}
      {historyError && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-4 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-yellow-400">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {historyError}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
          {/* 计算器主体 */}
          <div className="flex-1">
            <Calculator 
              isScientificMode={isScientificMode}
              onAddToHistory={addToHistory}
              history={history}
            />
          </div>
          
          {/* 历史记录面板 */}
          <div className={`lg:w-80 transition-all duration-300 ${
            isHistoryOpen ? 'block' : 'hidden lg:block'
          }`}>
            <HistoryPanel 
              history={history}
              onClearHistory={clearHistory}
              isOpen={isHistoryOpen}
              onClose={() => setIsHistoryOpen(false)}
              isLoading={historyLoading}
              syncWithServer={syncWithServer}
              onToggleSync={setSyncWithServer}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App