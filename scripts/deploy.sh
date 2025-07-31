#!/bin/bash

# 计算器应用部署脚本

echo "🚀 开始部署计算器应用..."

# 检查是否安装了必要的工具
if ! command -v git &> /dev/null; then
    echo "❌ Git 未安装，请先安装 Git"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 Node.js 和 npm"
    exit 1
fi

# 安装依赖
echo "📦 安装项目依赖..."
npm install

# 构建项目
echo "🔨 构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

echo "✅ 构建成功"

# 检查是否已经初始化 Git 仓库
if [ ! -d ".git" ]; then
    echo "🔧 初始化 Git 仓库..."
    git init
    git add .
    git commit -m "Initial commit: Calculator app"
fi

# 检查是否设置了远程仓库
if ! git remote get-url origin &> /dev/null; then
    echo "⚠️  请手动添加 GitHub 远程仓库："
    echo "   git remote add origin https://github.com/zc217888/calculator-app.git"
    echo "   git push -u origin main"
else
    echo "📤 推送到 GitHub..."
    git add .
    git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S')" || echo "没有新的更改"
    git push origin main
fi

echo "🎉 部署脚本执行完成！"
echo ""
echo "📋 下一步操作："
echo "1. 确保代码已推送到 GitHub: https://github.com/zc217888/calculator-app"
echo "2. 访问 Vercel: https://vercel.com"
echo "3. 导入 GitHub 仓库并部署"
echo "4. 配置自定义域名（可选）"