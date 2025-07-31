import React from 'react'
import { DisplayProps } from '../types/calculator'

const Display: React.FC<DisplayProps> = ({ expression, result, isError }) => {
  return (
    <div className="calculator-display min-h-[120px] flex flex-col justify-end">
      {/* 计算表达式 */}
      <div className="text-expression mb-2 min-h-[20px] overflow-hidden">
        {expression && (
          <div className="truncate" title={expression}>
            {expression}
          </div>
        )}
      </div>
      
      {/* 计算结果 */}
      <div className={`text-display font-semibold min-h-[48px] flex items-end justify-end ${
        isError ? 'text-red-400' : 'text-white'
      }`}>
        <div className="truncate" title={result}>
          {result || '0'}
        </div>
      </div>
    </div>
  )
}

export default Display