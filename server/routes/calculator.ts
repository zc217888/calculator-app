import express from 'express'
import { evaluate } from 'mathjs'

const router = express.Router()

// 计算接口
router.post('/calculate', (req, res) => {
  try {
    const { expression } = req.body

    if (!expression || typeof expression !== 'string') {
      return res.status(400).json({
        error: '参数错误',
        message: '请提供有效的计算表达式'
      })
    }

    // 清理和验证表达式
    const cleanExpression = expression.trim()
    if (!cleanExpression) {
      return res.status(400).json({
        error: '表达式为空',
        message: '计算表达式不能为空'
      })
    }

    // 执行计算
    const result = evaluate(cleanExpression)
    
    res.json({
      success: true,
      expression: cleanExpression,
      result: String(result),
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('计算错误:', error)
    res.status(400).json({
      error: '计算错误',
      message: '无效的数学表达式',
      expression: req.body.expression
    })
  }
})

// 验证表达式接口
router.post('/validate', (req, res) => {
  try {
    const { expression } = req.body

    if (!expression || typeof expression !== 'string') {
      return res.status(400).json({
        error: '参数错误',
        message: '请提供有效的表达式'
      })
    }

    // 尝试解析表达式
    evaluate(expression.trim())
    
    res.json({
      success: true,
      valid: true,
      message: '表达式有效'
    })

  } catch (error) {
    res.json({
      success: true,
      valid: false,
      message: '表达式无效'
    })
  }
})

// 支持的函数列表
router.get('/functions', (req, res) => {
  const functions = {
    basic: [
      { name: '+', description: '加法' },
      { name: '-', description: '减法' },
      { name: '*', description: '乘法' },
      { name: '/', description: '除法' },
      { name: '%', description: '取余' },
      { name: '^', description: '幂运算' }
    ],
    scientific: [
      { name: 'sin', description: '正弦函数' },
      { name: 'cos', description: '余弦函数' },
      { name: 'tan', description: '正切函数' },
      { name: 'sqrt', description: '平方根' },
      { name: 'log', description: '自然对数' },
      { name: 'log10', description: '常用对数' },
      { name: 'abs', description: '绝对值' },
      { name: 'round', description: '四舍五入' },
      { name: 'ceil', description: '向上取整' },
      { name: 'floor', description: '向下取整' }
    ],
    constants: [
      { name: 'pi', description: '圆周率π', value: Math.PI },
      { name: 'e', description: '自然常数e', value: Math.E }
    ]
  }

  res.json({
    success: true,
    functions
  })
})

export { router as calculatorRoutes }