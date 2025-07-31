import { evaluate, format } from 'mathjs'

// 数学表达式验证和清理
export class CalculatorUtils {
  // 验证表达式是否安全
  static validateExpression(expression: string): { valid: boolean; message?: string } {
    try {
      // 基本验证
      if (!expression || typeof expression !== 'string') {
        return { valid: false, message: '表达式必须是字符串' }
      }

      const cleanExpression = expression.trim()
      if (!cleanExpression) {
        return { valid: false, message: '表达式不能为空' }
      }

      // 检查危险字符和函数
      const dangerousPatterns = [
        /import\s/i,
        /require\s/i,
        /eval\s/i,
        /function\s/i,
        /=>/,
        /\bwhile\b/i,
        /\bfor\b/i,
        /\bif\b/i,
        /\breturn\b/i,
        /\bvar\b/i,
        /\blet\b/i,
        /\bconst\b/i
      ]

      for (const pattern of dangerousPatterns) {
        if (pattern.test(cleanExpression)) {
          return { valid: false, message: '表达式包含不允许的内容' }
        }
      }

      // 尝试解析表达式
      evaluate(cleanExpression)
      
      return { valid: true }
    } catch (error: any) {
      return { valid: false, message: error.message || '表达式语法错误' }
    }
  }

  // 清理和格式化表达式
  static cleanExpression(expression: string): string {
    return expression
      .trim()
      .replace(/\s+/g, ' ') // 规范化空格
      .replace(/×/g, '*')   // 替换乘号
      .replace(/÷/g, '/')   // 替换除号
      .replace(/−/g, '-')   // 替换减号
  }

  // 格式化计算结果
  static formatResult(result: any): string {
    try {
      // 处理复数
      if (typeof result === 'object' && result.re !== undefined && result.im !== undefined) {
        if (result.im === 0) {
          return this.formatNumber(result.re)
        } else {
          return `${this.formatNumber(result.re)} + ${this.formatNumber(result.im)}i`
        }
      }

      // 处理数字
      if (typeof result === 'number') {
        return this.formatNumber(result)
      }

      // 其他类型直接转换为字符串
      return String(result)
    } catch (error) {
      return String(result)
    }
  }

  // 格式化数字显示
  private static formatNumber(num: number): string {
    // 处理特殊值
    if (!isFinite(num)) {
      if (isNaN(num)) return '未定义'
      return num > 0 ? '∞' : '-∞'
    }

    // 处理非常小的数字
    if (Math.abs(num) < 1e-10 && num !== 0) {
      return format(num, { notation: 'exponential', precision: 3 })
    }

    // 处理非常大的数字
    if (Math.abs(num) > 1e12) {
      return format(num, { notation: 'exponential', precision: 6 })
    }

    // 处理小数
    if (num % 1 !== 0) {
      // 限制小数位数
      const rounded = Math.round(num * 1e10) / 1e10
      return rounded.toString()
    }

    return num.toString()
  }

  // 角度转弧度
  static degToRad(degrees: number): number {
    return degrees * Math.PI / 180
  }

  // 弧度转角度
  static radToDeg(radians: number): number {
    return radians * 180 / Math.PI
  }

  // 获取支持的数学函数列表
  static getSupportedFunctions() {
    return {
      basic: [
        { name: '+', description: '加法运算', example: '2 + 3 = 5' },
        { name: '-', description: '减法运算', example: '5 - 2 = 3' },
        { name: '*', description: '乘法运算', example: '3 * 4 = 12' },
        { name: '/', description: '除法运算', example: '8 / 2 = 4' },
        { name: '%', description: '取余运算', example: '7 % 3 = 1' },
        { name: '^', description: '幂运算', example: '2 ^ 3 = 8' }
      ],
      scientific: [
        { name: 'sin', description: '正弦函数', example: 'sin(30) = 0.5' },
        { name: 'cos', description: '余弦函数', example: 'cos(60) = 0.5' },
        { name: 'tan', description: '正切函数', example: 'tan(45) = 1' },
        { name: 'asin', description: '反正弦函数', example: 'asin(0.5) = 30°' },
        { name: 'acos', description: '反余弦函数', example: 'acos(0.5) = 60°' },
        { name: 'atan', description: '反正切函数', example: 'atan(1) = 45°' },
        { name: 'sqrt', description: '平方根', example: 'sqrt(16) = 4' },
        { name: 'log', description: '自然对数', example: 'log(e) = 1' },
        { name: 'log10', description: '常用对数', example: 'log10(100) = 2' },
        { name: 'abs', description: '绝对值', example: 'abs(-5) = 5' },
        { name: 'round', description: '四舍五入', example: 'round(3.7) = 4' },
        { name: 'ceil', description: '向上取整', example: 'ceil(3.2) = 4' },
        { name: 'floor', description: '向下取整', example: 'floor(3.8) = 3' },
        { name: 'exp', description: '指数函数', example: 'exp(1) = e' }
      ],
      constants: [
        { name: 'pi', description: '圆周率π', value: Math.PI },
        { name: 'e', description: '自然常数e', value: Math.E },
        { name: 'phi', description: '黄金比例φ', value: (1 + Math.sqrt(5)) / 2 }
      ]
    }
  }
}