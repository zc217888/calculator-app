# Vercel 部署成功经验总结

## 🎯 核心问题分析

### 常见的 Vercel 空白页面问题原因
1. **构建失败但没有明显错误提示**
2. **TypeScript 配置导致构建中断**
3. **Vercel 配置文件使用过时语法**
4. **静态文件路径配置错误**
5. **前后端路由冲突**

## 🔧 关键配置文件修复

### 1. package.json 构建脚本
```json
{
  "scripts": {
    // ❌ 错误写法 - 会因为 TypeScript 错误中断构建
    "build": "tsc && vite build",
    
    // ✅ 正确写法 - 只做类型检查，不生成文件
    "build": "tsc --noEmit && vite build"
  }
}
```

**关键点**：
- 使用 `--noEmit` 标志只进行类型检查
- 让 Vite 负责实际的构建输出
- 避免 TypeScript 编译错误中断整个构建过程

### 2. tsconfig.json 配置
```json
{
  "compilerOptions": {
    // ✅ 关键配置 - 不生成输出文件
    "noEmit": true,
    "jsx": "react-jsx",
    "moduleResolution": "bundler"
  },
  "include": ["src"],
  // ✅ 重要 - 排除服务器端代码
  "exclude": ["server", "api"]
}
```

**注意事项**：
- `noEmit: true` 确保 TypeScript 不生成文件
- 正确设置 `include` 和 `exclude` 路径
- 使用 `react-jsx` 而不是 `react`

### 3. vercel.json 现代化配置
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": null,
  // ✅ 使用现代的 rewrites 而不是 routes
  "rewrites": [
    {
      "source": "/((?!api/.*).*)",
      "destination": "/index.html"
    }
  ]
}
```

**关键改进**：
- 使用 `rewrites` 替代过时的 `routes`
- 正确的正则表达式排除 API 路由
- 设置 `framework: null` 让 Vercel 自动检测

### 4. vite.config.ts 优化配置
```typescript
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,        // 生产环境关闭 sourcemap
    emptyOutDir: true,       // 构建前清空输出目录
    rollupOptions: {
      output: {
        manualChunks: undefined, // 避免过度分包
      },
    },
  },
  base: './',              // 重要：相对路径基础
})
```

## 🚨 重要注意事项

### 1. 构建过程检查
```bash
# 本地测试构建
npm run build

# 检查输出目录
ls -la dist/
# 应该看到：index.html, assets/ 目录, 静态资源文件
```

### 2. API 路由配置
```typescript
// api/calculate.ts
export default function handler(req: VercelRequest, res: VercelResponse) {
  // ✅ 必须设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // ✅ 处理预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
}
```

### 3. 前端 API 调用
```typescript
// ✅ 使用相对路径，不要硬编码域名
const response = await fetch('/api/calculate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ expression })
})
```

## 🔍 问题排查步骤

### 1. 本地构建验证
```bash
# 清理旧构建
rm -rf dist/

# 重新构建
npm run build

# 检查构建输出
ls -la dist/
```

### 2. Vercel 部署日志检查
- 在 Vercel Dashboard 查看构建日志
- 关注 "Build" 和 "Output" 阶段
- 查找红色错误信息

### 3. 浏览器调试
```javascript
// 在浏览器控制台检查
console.log('页面加载状态:', document.readyState)
console.log('根元素:', document.getElementById('root'))

// 检查网络请求
// Network 标签页查看静态资源加载情况
```

## 📋 部署前检查清单

### 构建配置检查
- [ ] `package.json` 构建脚本使用 `tsc --noEmit`
- [ ] `tsconfig.json` 设置 `noEmit: true`
- [ ] `vite.config.ts` 配置 `base: './'`
- [ ] `vercel.json` 使用 `rewrites` 而不是 `routes`

### 文件结构检查
- [ ] `src/` 包含所有前端代码
- [ ] `api/` 包含 Vercel Functions
- [ ] `dist/` 构建后包含 `index.html` 和 `assets/`
- [ ] 静态资源在 `public/` 目录

### API 配置检查
- [ ] 所有 API 函数设置正确的 CORS 头
- [ ] 处理 OPTIONS 预检请求
- [ ] 使用相对路径调用 API

## 🎯 最佳实践

### 1. 项目结构
```
project/
├── src/                 # 前端 React 代码
├── api/                 # Vercel Serverless Functions
├── public/              # 静态资源
├── dist/                # 构建输出（自动生成）
├── server/              # 本地开发服务器（可选）
├── package.json
├── vercel.json
├── vite.config.ts
└── tsconfig.json
```

### 2. 环境变量管理
```bash
# .env.local (本地开发)
VITE_API_URL=http://localhost:3001

# Vercel 环境变量（生产环境）
# 在 Vercel Dashboard 中设置
```

### 3. 部署流程
```bash
# 1. 本地测试
npm run build
npm run preview

# 2. 提交代码
git add .
git commit -m "修复部署配置"
git push

# 3. Vercel 部署
vercel --prod
```

## 🐛 常见错误及解决方案

### 错误1：空白页面
**原因**：构建失败或静态文件路径错误
**解决**：检查构建输出，修复 `base` 配置

### 错误2：API 调用失败
**原因**：CORS 配置错误或路径问题
**解决**：设置正确的 CORS 头，使用相对路径

### 错误3：TypeScript 编译错误
**原因**：类型检查失败中断构建
**解决**：使用 `tsc --noEmit` 只做类型检查

### 错误4：路由冲突
**原因**：前端路由和 API 路由冲突
**解决**：在 `vercel.json` 中正确配置路由规则

## 🚀 性能优化建议

### 1. 构建优化
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          math: ['mathjs']
        }
      }
    }
  }
})
```

### 2. 代码分割
```typescript
// 使用动态导入
const Calculator = lazy(() => import('./components/Calculator'))
```

### 3. 静态资源优化
- 压缩图片资源
- 使用 WebP 格式
- 启用 Vercel 的自动优化

## 📞 故障排除联系方式

如果遇到问题，按以下顺序排查：
1. 检查本地构建是否成功
2. 查看 Vercel 部署日志
3. 检查浏览器控制台错误
4. 验证 API 端点响应
5. 对比工作配置文件

记住：**大部分 Vercel 空白页面问题都是构建配置问题，而不是代码逻辑问题！**