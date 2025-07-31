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
        return res.status(200).json({
          success: true,
          data: { valid: false }
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
        return res.status(200).json({
          success: true,
          data: { valid: false }
        })
      }

      // 尝试解析表达式
      try {
        evaluate(expression)
        res.status(200).json({
          success: true,
          data: { valid: true }
        })
      } catch (error) {
        res.status(200).json({
          success: true,
          data: { valid: false }
        })
      }

    } catch (error: any) {
      console.error('验证错误:', error)
      res.status(200).json({
        success: true,
        data: { valid: false }
      })
    }
  } else {
    res.status(405).json({
      success: false,
      error: '方法不被允许'
    })
  }
}