import { VercelRequest, VercelResponse } from '@vercel/node'
import { evaluate } from 'mathjs'

export default function handler(req: VercelRequest, res: VercelResponse) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method === 'POST') {
    try {
      const { expression } = req.body

      if (!expression || typeof expression !== 'string') {
        return res.status(400).json({
          success: false,
          error: '表达式不能为空'
        })
      }

      // 验证表达式安全性
      const dangerousPatterns = [
        /import/i,
        /require/i,
        /eval/i,
        /function/i,
        /=>/i,
        /\bwhile\b/i,
        /\bfor\b/i,
        /\bif\b/i
      ]

      if (dangerousPatterns.some(pattern => pattern.test(expression))) {
        return res.status(400).json({
          success: false,
          error: '表达式包含不安全的内容'
        })
      }

      // 计算表达式
      const result = evaluate(expression)
      
      res.status(200).json({
        success: true,
        data: {
          expression,
          result: String(result)
        }
      })

    } catch (error: any) {
      console.error('计算错误:', error)
      res.status(400).json({
        success: false,
        error: error.message || '计算失败'
      })
    }
  } else {
    res.status(405).json({
      success: false,
      error: '方法不被允许'
    })
  }
}