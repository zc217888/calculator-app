import express from 'express'
import cors from 'cors'
import { calculatorRoutes } from './routes/calculator'
import { historyRoutes } from './routes/history'

const app = express()
const PORT = process.env.PORT || 3001

// 中间件配置
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.vercel.app'] 
    : ['http://localhost:3000'],
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 路由配置
app.use('/api/calculator', calculatorRoutes)
app.use('/api/history', historyRoutes)

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: '计算器API服务运行正常',
    timestamp: new Date().toISOString()
  })
})

// 根路径
app.get('/', (req, res) => {
  res.json({
    name: '智能计算器 API',
    version: '1.0.0',
    description: '提供计算器功能的后端API服务',
    endpoints: {
      health: '/api/health',
      calculator: '/api/calculator',
      history: '/api/history'
    }
  })
})

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('服务器错误:', err)
  res.status(500).json({
    error: '服务器内部错误',
    message: process.env.NODE_ENV === 'development' ? err.message : '请稍后重试'
  })
})

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    error: '接口不存在',
    message: `路径 ${req.originalUrl} 未找到`
  })
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 计算器API服务已启动`)
  console.log(`📍 本地地址: http://localhost:${PORT}`)
  console.log(`🌍 环境: ${process.env.NODE_ENV || 'development'}`)
})

export default app