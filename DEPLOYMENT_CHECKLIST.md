eVercel 部署检查清单

## ✅ 已修复的问题

1. **构建配置**
   - ✅ `vercel.json` 配置正确
   - ✅ 构建输出目录设置为 `dist`
   - ✅ 路由配置正确

2. **静态资源**
   - ✅ 图标文件 `calculator-icon.svg` 已创建
   - ✅ 构建文件完整（HTML、CSS、JS）

3. **API 配置**
   - ✅ API 路径修复（`/calculate` 对应 `api/calculate.ts`）
   - ✅ CORS 配置正确

## 🚀 部署步骤

1. **提交代码**
   ```bash
   git add .
   git commit -m "修复部署配置"
   git push
   ```

2. **重新部署**
   - 在 Vercel 控制台点击 "Redeploy"
   - 或者推送代码触发自动部署

## 🔍 可能的原因分析

如果部署后仍然空白，可能的原因：

1. **JavaScript 错误**
   - 打开浏览器开发者工具查看控制台错误
   - 检查网络请求是否失败

2. **路径问题**
   - 确保所有资源路径正确
   - 检查 API 端点是否可访问

3. **构建问题**
   - 确保本地构建成功
   - 检查 `dist` 目录内容完整

## 🛠️ 调试步骤

1. **本地测试**
   ```bash
   npm run build
   npm run preview
   ```

2. **检查构建输出**
   ```bash
   ls -la dist/
   ls -la dist/assets/
   ```

3. **测试 API**
   - 访问 `https://your-domain.vercel.app/api/calculate`
   - 发送 POST 请求测试

## 📝 注意事项

- 确保 `package.json` 中的构建脚本正确
- 检查 TypeScript 编译是否成功
- 验证所有依赖项都已安装