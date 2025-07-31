const fs = require('fs');
const path = require('path');

console.log('🔧 修复部署问题...');

// 1. 检查并创建 public 目录
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log('✅ 创建 public 目录');
}

// 2. 检查图标文件
const iconPath = path.join(publicDir, 'calculator-icon.svg');
if (!fs.existsSync(iconPath)) {
  const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="4" y="2" width="16" height="20" rx="2"/>
  <line x1="8" y1="6" x2="16" y2="6"/>
  <line x1="16" y1="10" x2="16" y2="10"/>
  <line x1="12" y1="10" x2="12" y2="10"/>
  <line x1="8" y1="10" x2="8" y2="10"/>
  <line x1="16" y1="14" x2="16" y2="14"/>
  <line x1="12" y1="14" x2="12" y2="14"/>
  <line x1="8" y1="14" x2="8" y2="14"/>
  <line x1="16" y1="18" x2="16" y2="18"/>
  <line x1="12" y1="18" x2="12" y2="18"/>
  <line x1="8" y1="18" x2="8" y2="18"/>
</svg>`;
  fs.writeFileSync(iconPath, iconSvg);
  console.log('✅ 创建图标文件');
}

// 3. 检查 dist 目录
const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  console.log('✅ dist 目录存在');
  const files = fs.readdirSync(distDir);
  console.log('📁 dist 目录内容:', files);
} else {
  console.log('❌ dist 目录不存在，需要运行构建');
}

console.log('🎉 修复完成！');