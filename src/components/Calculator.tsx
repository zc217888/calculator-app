import React, { useState, useEffect, useCallback } from 'react'
import { evaluate } from 'mathjs'
import Display from './Display'
import { CalculatorProps, CalculatorState, CalculationHistory } from '../types/calculator'
import { useCalculator } from '../hooks/useCalculator'

const Calculator: React.FC<CalculatorProps> = ({
  isScientificMode,
  onAddToHistory
}) => {
  const [state, setState] = useState<CalculatorState>({
    display: '0',
    expression: '',
    previousValue: '',
    operation: null,
    waitingForNewValue: false,
    isError: false
  })

  const { 
    calculateExpression: calculateWithApi,
    syncHistoryToServer 
  } = useCalculator()

  // 基础按钮配置
  const basicButtons = [
    { label: 'C', value: 'clear', type: 'clear' as const, className: 'button-clear' },
    { label: '±', value: 'negate', type: 'special' as const, className: 'button-special' },
    { label: '%', value: '%', type: 'operator' as const, className: 'button-operator' },
    { label: '÷', value: '/', type: 'operator' as const, className: 'button-operator' },
    
    { label: '7', value: '7', type: 'number' as const, className: 'button-number' },
    { label: '8', value: '8', type: 'number' as const, className: 'button-number' },
    { label: '9', value: '9', type: 'number' as const, className: 'button-number' },
    { label: '×', value: '*', type: 'operator' as const, className: 'button-operator' },
    
    { label: '4', value: '4', type: 'number' as const, className: 'button-number' },
    { label: '5', value: '5', type: 'number' as const, className: 'button-number' },
    { label: '6', value: '6', type: 'number' as const, className: 'button-number' },
    { label: '−', value: '-', type: 'operator' as const, className: 'button-operator' },
    
    { label: '1', value: '1', type: 'number' as const, className: 'button-number' },
    { label: '2', value: '2', type: 'number' as const, className: 'button-number' },
    { label: '3', value: '3', type: 'number' as const, className: 'button-number' },
    { label: '+', value: '+', type: 'operator' as const, className: 'button-operator' },
    
    { label: '0', value: '0', type: 'number' as const, className: 'button-number', colspan: 2 },
    { label: '.', value: '.', type: 'number' as const, className: 'button-number' },
    { label: '=', value: '=', type: 'equals' as const, className: 'button-operator' },
  ]

  // 科学计算按钮配置
  const scientificButtons = [
    { label: 'sin', value: 'sin', type: 'special' as const, className: 'button-special' },
    { label: 'cos', value: 'cos', type: 'special' as const, className: 'button-special' },
    { label: 'tan', value: 'tan', type: 'special' as const, className: 'button-special' },
    { label: 'ln', value: 'ln', type: 'special' as const, className: 'button-special' },
    { label: 'log', value: 'log10', type: 'special' as const, className: 'button-special' },
    { label: '√', value: 'sqrt', type: 'special' as const, className: 'button-special' },
    { label: 'x²', value: '^2', type: 'special' as const, className: 'button-special' },
    { label: 'xʸ', value: '^', type: 'operator' as const, className: 'button-operator' },
    { label: '(', value: '(', type: 'special' as const, className: 'button-special' },
    { label: ')', value: ')', type: 'special' as const, className: 'button-special' },
    { label: 'π', value: 'pi', type: 'special' as const, className: 'button-special' },
    { label: 'e', value: 'e', type: 'special' as const, className: 'button-special' },
  ]

  // 处理按钮点击
  const handleButtonClick = useCallback((value: string, type: string) => {
    setState(prevState => {
      let newState = { ...prevState, isError: false }

      switch (type) {
        case 'clear':
          return {
            display: '0',
            expression: '',
            previousValue: '',
            operation: null,
            waitingForNewValue: false,
            isError: false
          }

        case 'number':
          if (value === '.' && newState.display.includes('.')) {
            return newState
          }
          
          if (newState.waitingForNewValue || newState.display === '0') {
            newState.display = value === '.' ? '0.' : value
            newState.waitingForNewValue = false
          } else {
            newState.display = newState.display + value
          }
          break

        case 'operator':
          if (newState.expression && !newState.waitingForNewValue) {
            try {
              const result = evaluate(newState.expression + newState.display)
              newState.display = String(result)
            } catch (error) {
              newState.isError = true
              newState.display = '错误'
              return newState
            }
          }
          
          newState.expression = newState.display + ' ' + value + ' '
          newState.waitingForNewValue = true
          break

        case 'equals':
          try {
            // 获取要计算的表达式
            let expressionToCalculate: string
            
            if (newState.expression) {
              // 如果有表达式（如 "5 + "），则拼接当前显示值
              expressionToCalculate = newState.expression + newState.display
            } else {
              // 如果没有表达式，直接使用当前显示值（如函数表达式 "sin(30)"）
              expressionToCalculate = newState.display
            }
            
            // 检查是否需要自动补全右括号
            const openParens = (expressionToCalculate.match(/\(/g) || []).length
            const closeParens = (expressionToCalculate.match(/\)/g) || []).length
            const missingParens = openParens - closeParens
            
            if (missingParens > 0) {
              expressionToCalculate += ')'.repeat(missingParens)
            }
            
            // 尝试使用API计算，如果失败则使用本地计算
            const performCalculation = async () => {
              let result: string
              let calculationError = false
              
              try {
                // 优先使用API计算
                const apiResult = await calculateWithApi(expressionToCalculate)
                if (apiResult !== null) {
                  result = apiResult
                } else {
                  // API失败，使用本地计算
                  const localResult = evaluate(expressionToCalculate)
                  result = String(localResult)
                }
              } catch (error) {
                // 本地计算也失败
                calculationError = true
                result = '错误'
                console.error('计算错误:', error)
              }
              
              if (!calculationError) {
                // 添加到历史记录
                const historyItem: CalculationHistory = {
                  id: Date.now().toString(),
                  expression: expressionToCalculate,
                  result: result,
                  timestamp: new Date()
                }
                
                onAddToHistory(historyItem)
                
                // 同步到服务器
                try {
                  await syncHistoryToServer(historyItem)
                } catch (error) {
                  console.warn('同步历史记录到服务器失败:', error)
                }
              }
              
              setState(prev => ({
                ...prev,
                display: result,
                expression: '',
                waitingForNewValue: true,
                isError: calculationError
              }))
            }
            
            performCalculation()
            return newState // 返回当前状态，异步更新会在performCalculation中处理
            
          } catch (error) {
            newState.isError = true
            newState.display = '错误'
            console.error('Equals处理错误:', error)
          }
          break

        case 'special':
          switch (value) {
            case 'negate':
              try {
                const currentValue = parseFloat(newState.display)
                const result = -currentValue
                newState.display = String(result)
                newState.waitingForNewValue = true
              } catch (error) {
                newState.isError = true
                newState.display = '错误'
              }
              break
              
            case '^2':
              try {
                const currentValue = parseFloat(newState.display)
                const result = Math.pow(currentValue, 2)
                newState.display = String(result)
                newState.waitingForNewValue = true
              } catch (error) {
                newState.isError = true
                newState.display = '错误'
              }
              break
              
            case 'pi':
              if (newState.waitingForNewValue || newState.display === '0') {
                newState.display = 'pi'
              } else {
                newState.display = newState.display + 'pi'
              }
              newState.waitingForNewValue = false
              break
              
            case 'e':
              if (newState.waitingForNewValue || newState.display === '0') {
                newState.display = 'e'
              } else {
                newState.display = newState.display + 'e'
              }
              newState.waitingForNewValue = false
              break
              
            case 'sin':
            case 'cos':
            case 'tan':
            case 'ln':
            case 'log10':
            case 'sqrt':
              // 函数式输入：显示函数名和左括号
              if (newState.waitingForNewValue || newState.display === '0') {
                newState.display = value + '('
              } else {
                newState.display = newState.display + value + '('
              }
              newState.waitingForNewValue = false
              break
              
            case '(':
              if (newState.waitingForNewValue || newState.display === '0') {
                newState.display = '('
              } else {
                newState.display = newState.display + '('
              }
              newState.waitingForNewValue = false
              break
              
            case ')':
              if (newState.display !== '0' && !newState.waitingForNewValue) {
                newState.display = newState.display + ')'
              }
              break
              
            default:
              return newState
          }
          break
      }

      return newState
    })
  }, [onAddToHistory])

  // 键盘事件处理
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key
      
      if (key >= '0' && key <= '9' || key === '.') {
        handleButtonClick(key, 'number')
      } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        handleButtonClick(key, 'operator')
      } else if (key === 'Enter' || key === '=') {
        handleButtonClick('=', 'equals')
      } else if (key === 'Escape' || key === 'c' || key === 'C') {
        handleButtonClick('clear', 'clear')
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleButtonClick])

  return (
    <div className="bg-white rounded-xl shadow-calculator p-6 max-w-md mx-auto">
      {/* 显示屏 */}
      <Display 
        expression={state.expression}
        result={state.display}
        isError={state.isError}
      />

      {/* 科学计算按钮区域 */}
      {isScientificMode && (
        <div className="grid grid-cols-4 gap-3 mt-6 mb-4">
          {scientificButtons.map((button, index) => (
            <button
              key={index}
              className={`h-12 text-sm ${button.className}`}
              onClick={() => handleButtonClick(button.value, button.type)}
            >
              {button.label}
            </button>
          ))}
        </div>
      )}

      {/* 基础按钮区域 */}
      <div className="grid grid-cols-4 gap-3 mt-6">
        {basicButtons.map((button, index) => (
          <button
            key={index}
            className={`h-14 text-lg ${button.className} ${
              button.colspan === 2 ? 'col-span-2' : ''
            }`}
            onClick={() => handleButtonClick(button.value, button.type)}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Calculator