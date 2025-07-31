# 🚀 Vercel 部署指南

## 项目信息
- **GitHub仓库**: https://github.com/zc217888/calculator-app
- **项目类型**: React + TypeScript + Vite
- **后端**: Vercel Serverless Functions

## 部署步骤

### 1. 访问 Vercel
打开浏览器访问：https://vercel.com

### 2. 登录账户
- 点击右上角 "Login" 
- 建议使用 GitHub 账户登录，这样可以直接访问你的仓库

### 3. 导入项目
1. 登录后点击 "New Project"
2. 在 "Import Git Repository" 部分找到 `zc217888/calculator-app`
3. 点击 "Import" 按钮

### 4. 配置项目设置
在项目配置页面设置以下参数：

**基本设置:**
- **Project Name**: `calculator-app` (或你喜欢的名称)
- **Framework Preset**: `Vite` (Vercel会自动检测)
- **Root Directory**: `./` (保持默认)

**构建设置:**
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

### 5. 环境变量 (可选)
如果需要设置环境变量，在 "Environment Variables" 部分添加：
```
NODE_ENV=production
```

### 6. 部署
1. 确认所有设置正确后，点击 "Deploy" 按钮
2. Vercel 会自动开始构建和部署过程
3. 等待部署完成（通常需要1-3分钟）

### 7. 获取部署链接
部署成功后，你会得到一个类似这样的链接：
- **生产环境**: `https://calculator-app-zc217888.vercel.app`
- **预览环境**: `https://calculator-app-git-main-zc217888.vercel.app`

## 🔧 自动部署配置

项目已经配置了 GitHub Actions，每次推送到 main 分支时会自动部署到 Vercel。

## 📱 功能验证

部署完成后，请验证以下功能：
1. ✅ 基础计算功能 (加减乘除)
2. ✅ 科学计算功能 (三角函数、对数等)
3. ✅ 历史记录保存和查看
4. ✅ 响应式设计 (手机、平板、桌面)
5. ✅ API 接口正常工作

## 🌐 自定义域名 (可选)

如果你有自己的域名，可以在 Vercel 项目设置中的 "Domains" 部分添加：
1. 点击 "Add Domain"
2. 输入你的域名
3. 按照提示配置 DNS 记录

## 🚨 常见问题

### 构建失败
如果构建失败，检查：
1. package.json 中的依赖是否正确
2. TypeScript 类型错误
3. 构建命令是否正确

### API 不工作
确保 API 路由文件在 `/api` 目录下，Vercel 会自动将其转换为 Serverless Functions。

### 404 错误
确保 vercel.json 中的路由配置正确，特别是 SPA 路由重写规则。

## 📞 支持

如果遇到问题，可以：
1. 查看 Vercel 部署日志
2. 检查浏览器控制台错误
3. 参考 Vercel 官方文档: https://vercel.com/docs