import express from 'express'

const router = express.Router()

// 内存存储历史记录（生产环境建议使用数据库）
interface CalculationHistory {
  id: string
  expression: string
  result: string
  timestamp: Date
  userAgent?: string
}

let historyStore: CalculationHistory[] = []

// 获取计算历史
router.get('/', (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query
    
    const limitNum = parseInt(limit as string) || 50
    const offsetNum = parseInt(offset as string) || 0
    
    const paginatedHistory = historyStore
      .slice(offsetNum, offsetNum + limitNum)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    
    res.json({
      success: true,
      data: paginatedHistory,
      total: historyStore.length,
      limit: limitNum,
      offset: offsetNum
    })
  } catch (error) {
    console.error('获取历史记录错误:', error)
    res.status(500).json({
      error: '服务器错误',
      message: '无法获取历史记录'
    })
  }
})

// 添加计算历史
router.post('/', (req, res) => {
  try {
    const { expression, result } = req.body
    
    if (!expression || !result) {
      return res.status(400).json({
        error: '参数错误',
        message: '表达式和结果不能为空'
      })
    }
    
    const historyItem: CalculationHistory = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      expression: expression.trim(),
      result: result.toString(),
      timestamp: new Date(),
      userAgent: req.get('User-Agent')
    }
    
    // 添加到历史记录开头
    historyStore.unshift(historyItem)
    
    // 限制历史记录数量（最多保存1000条）
    if (historyStore.length > 1000) {
      historyStore = historyStore.slice(0, 1000)
    }
    
    res.status(201).json({
      success: true,
      data: historyItem,
      message: '历史记录已保存'
    })
    
  } catch (error) {
    console.error('保存历史记录错误:', error)
    res.status(500).json({
      error: '服务器错误',
      message: '无法保存历史记录'
    })
  }
})

// 删除指定历史记录
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params
    
    const initialLength = historyStore.length
    historyStore = historyStore.filter(item => item.id !== id)
    
    if (historyStore.length === initialLength) {
      return res.status(404).json({
        error: '记录不存在',
        message: '未找到指定的历史记录'
      })
    }
    
    res.json({
      success: true,
      message: '历史记录已删除'
    })
    
  } catch (error) {
    console.error('删除历史记录错误:', error)
    res.status(500).json({
      error: '服务器错误',
      message: '无法删除历史记录'
    })
  }
})

// 清空所有历史记录
router.delete('/', (req, res) => {
  try {
    const deletedCount = historyStore.length
    historyStore = []
    
    res.json({
      success: true,
      message: `已清空 ${deletedCount} 条历史记录`
    })
    
  } catch (error) {
    console.error('清空历史记录错误:', error)
    res.status(500).json({
      error: '服务器错误',
      message: '无法清空历史记录'
    })
  }
})

// 获取历史记录统计信息
router.get('/stats', (req, res) => {
  try {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    
    const stats = {
      total: historyStore.length,
      today: historyStore.filter(item => new Date(item.timestamp) >= today).length,
      thisWeek: historyStore.filter(item => new Date(item.timestamp) >= thisWeek).length,
      thisMonth: historyStore.filter(item => new Date(item.timestamp) >= thisMonth).length,
      oldestRecord: historyStore.length > 0 ? historyStore[historyStore.length - 1].timestamp : null,
      newestRecord: historyStore.length > 0 ? historyStore[0].timestamp : null
    }
    
    res.json({
      success: true,
      data: stats
    })
    
  } catch (error) {
    console.error('获取统计信息错误:', error)
    res.status(500).json({
      error: '服务器错误',
      message: '无法获取统计信息'
    })
  }
})

export { router as historyRoutes }