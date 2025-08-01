# Vercel 部署快速参考卡 🚀

## 🔥 最关键的配置（必须正确）

### package.json
```json
"build": "tsc --noEmit && vite build"
```

### vercel.json
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/((?!api/.*).*)",
      "destination": "/index.html"
    }
  ]
}
```

### vite.config.ts
```typescript
export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  base: './',  // 🔥 关键配置
})
```

## ⚡ 快速排查命令

```bash
# 1. 清理并重新构建
rm -rf dist && npm run build

# 2. 检查构建输出
ls -la dist/

# 3. 本地预览
npm run preview

# 4. 部署到 Vercel
vercel --prod
```

## 🚨 常见错误速查

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 空白页面 | 构建失败 | 检查 `tsc --noEmit` |
| 404 错误 | 路由配置错误 | 使用 `rewrites` 不是 `routes` |
| API 失败 | CORS 问题 | 设置正确的 CORS 头 |
| 静态资源 404 | 路径错误 | 设置 `base: './'` |

## 📋 部署前 30 秒检查

- [ ] `npm run build` 成功
- [ ] `dist/index.html` 存在
- [ ] `vercel.json` 使用 `rewrites`
- [ ] API 文件在 `api/` 目录
- [ ] 没有硬编码的 URL

## 🎯 一键部署脚本

```bash
#!/bin/bash
echo "🧹 清理旧文件..."
rm -rf dist

echo "🔨 重新构建..."
npm run build

echo "🚀 部署到 Vercel..."
vercel --prod

echo "✅ 部署完成！"
```

## 💡 记住这些要点

1. **TypeScript 只做类型检查**：`tsc --noEmit`
2. **Vite 负责构建**：`vite build`
3. **使用相对路径**：`base: './'`
4. **现代 Vercel 配置**：`rewrites` 不是 `routes`
5. **API 必须设置 CORS**：所有 API 文件都要设置

---
**保存这个文件，下次部署直接参考！** 🎉