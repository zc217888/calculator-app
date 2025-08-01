# Vercel 部署指南

## 🎯 问题解决总结

你的项目在本地运行正常但在 Vercel 上显示空白页面的问题已经修复！主要问题和解决方案：

### 🔍 问题诊断
1. **构建脚本问题**：`package.json` 中的构建命令 `tsc && vite build` 因为 TypeScript 配置问题导致失败
2. **TypeScript 配置**：`tsconfig.json` 中的 `noEmit: true` 设置导致类型检查失败时构建中断
3. **Vercel 配置**：`vercel.json` 使用了过时的 `routes` 配置而不是推荐的 `rewrites`

### ✅ 已修复的问题
1. **修复构建脚本**：改为 `tsc --noEmit && vite build`，只进行类型检查不生成文件
2. **优化 Vite 配置**：添加了更好的构建选项和基础路径配置
3. **更新 Vercel 配置**：使用现代的 `rewrites` 配置替代 `routes`
4. **验证构建输出**：确认 `dist` 目录正确生成所有必要文件

## 🚀 部署步骤

### 方法一：使用 Vercel CLI（推荐）

1. **安装 Vercel CLI**（如果还没安装）：
   ```bash
   npm i -g vercel
   ```

2. **登录 Vercel**：
   ```bash
   vercel login
   ```

3. **部署项目**：
   ```bash
   vercel --prod
   ```

### 方法二：使用 Git 部署

1. **提交所有更改**：
   ```bash
   git add .
   git commit -m "修复 Vercel 部署配置"
   git push origin main
   ```

2. **在 Vercel Dashboard 中触发重新部署**

## 📋 部署后检查清单

### 1. 基础功能检查
- [ ] 访问部署 URL，确认页面正常显示
- [ ] 检查计算器界面是否完整加载
- [ ] 测试基础数学运算（加减乘除）
- [ ] 测试科学计算功能

### 2. API 功能检查
- [ ] 测试计算 API：`/api/calculate`
- [ ] 测试历史记录 API：`/api/history`
- [ ] 检查 CORS 配置是否正常

### 3. 技术检查
- [ ] 打开浏览器开发者工具，检查控制台是否有错误
- [ ] 检查网络请求是否正常
- [ ] 验证静态资源（CSS、JS）是否正确加载

## 🔧 配置文件说明

### package.json
```json
{
  "scripts": {
    "build": "tsc --noEmit && vite build"
  }
}
```
- `tsc --noEmit`：只进行 TypeScript 类型检查，不生成文件
- `vite build`：使用 Vite 进行实际构建

### vercel.json
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": null,
  "rewrites": [
    {
      "source": "/((?!api/.*).*)",
      "destination": "/index.html"
    }
  ]
}
```
- 使用 `rewrites` 而不是 `routes`
- 正确处理 SPA 路由和 API 路由分离

### vite.config.ts
```typescript
export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: false,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  base: './',
})
```
- 优化构建输出
- 设置正确的基础路径

## 🐛 常见问题排查

### 如果部署后仍然显示空白页面：

1. **检查构建日志**：
   - 在 Vercel Dashboard 中查看部署日志
   - 确认构建过程没有错误

2. **检查文件路径**：
   - 确认 `dist/index.html` 存在
   - 检查静态资源路径是否正确

3. **检查浏览器控制台**：
   - 查看是否有 JavaScript 错误
   - 检查网络请求是否失败

4. **验证 API 端点**：
   - 直接访问 `https://your-domain.vercel.app/api/calculate`
   - 确认 API 返回正确响应

## 📞 获取帮助

如果遇到问题，请提供以下信息：
1. Vercel 部署 URL
2. 浏览器控制台错误信息
3. Vercel 部署日志截图

## 🎉 部署成功！

恭喜！你的在线计算器现在应该可以在 Vercel 上正常运行了。享受你的全功能计算器应用吧！