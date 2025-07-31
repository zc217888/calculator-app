import { VercelRequest, VercelResponse } from '@vercel/node'

// 内存存储历史记录（生产环境建议使用数据库）
let historyStore: Array<{
  id: string
  expression: string
  result: string
  timestamp: string
}> = []

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

  try {
    switch (req.method) {
      case 'GET':
        // 获取历史记录
        const { limit = '50', offset = '0' } = req.query
        const limitNum = parseInt(limit as string, 10)
        const offsetNum = parseInt(offset as string, 10)
        
        const paginatedHistory = historyStore
          .slice(offsetNum, offsetNum + limitNum)
          .reverse() // 最新的在前面
        
        res.status(200).json({
          success: true,
          data: paginatedHistory,
          total: historyStore.length
        })
        break

      case 'POST':
        // 添加历史记录
        const { expression, result } = req.body
        
        if (!expression || !result) {
          return res.status(400).json({
            success: false,
            error: '表达式和结果不能为空'
          })
        }

        const newHistory = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          expression: String(expression),
          result: String(result),
          timestamp: new Date().toISOString()
        }

        historyStore.unshift(newHistory) // 添加到开头
        
        // 限制历史记录数量
        if (historyStore.length > 1000) {
          historyStore = historyStore.slice(0, 1000)
        }

        res.status(201).json({
          success: true,
          data: newHistory
        })
        break

      case 'DELETE':
        const { id } = req.query
        
        if (id) {
          // 删除特定记录
          const index = historyStore.findIndex(item => item.id === id)
          if (index !== -1) {
            historyStore.splice(index, 1)
            res.status(200).json({
              success: true,
              message: '历史记录已删除'
            })
          } else {
            res.status(404).json({
              success: false,
              error: '历史记录不存在'
            })
          }
        } else {
          // 清空所有历史记录
          historyStore = []
          res.status(200).json({
            success: true,
            message: '所有历史记录已清除'
          })
        }
        break

      default:
        res.status(405).json({
          success: false,
          error: '方法不被允许'
        })
    }
  } catch (error: any) {
    console.error('历史记录API错误:', error)
    res.status(500).json({
      success: false,
      error: error.message || '服务器内部错误'
    })
  }
}