#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始部署到 Vercel...\n');

// 检查必要的文件
const requiredFiles = [
  'package.json',
  'vercel.json',
  'vite.config.ts',
  'src/main.tsx',
  'index.html'
];

console.log('📋 检查必要文件...');
for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`❌ 缺少必要文件: ${file}`);
    process.exit(1);
  }
  console.log(`✅ ${file}`);
}

// 清理旧的构建文件
console.log('\n🧹 清理旧的构建文件...');
if (fs.existsSync('dist')) {
  execSync('rmdir /s /q dist', { stdio: 'inherit', shell: true });
}

// 重新构建项目
console.log('\n🔨 重新构建项目...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ 构建成功!');
} catch (error) {
  console.error('❌ 构建失败:', error.message);
  process.exit(1);
}

// 检查构建输出
console.log('\n📦 检查构建输出...');
if (!fs.existsSync('dist/index.html')) {
  console.error('❌ 构建输出不完整，缺少 index.html');
  process.exit(1);
}

const distFiles = fs.readdirSync('dist');
console.log('构建文件:', distFiles);

// 部署到 Vercel
console.log('\n🌐 部署到 Vercel...');
console.log('请运行以下命令来部署:');
console.log('');
console.log('  npx vercel --prod');
console.log('');
console.log('或者如果你已经安装了 Vercel CLI:');
console.log('');
console.log('  vercel --prod');
console.log('');
console.log('📝 部署后检查清单:');
console.log('1. 检查部署 URL 是否显示计算器界面');
console.log('2. 测试基础计算功能');
console.log('3. 测试 API 端点 (/api/calculate, /api/history)');
console.log('4. 检查浏览器控制台是否有错误');
console.log('');
console.log('🎉 准备完成！');