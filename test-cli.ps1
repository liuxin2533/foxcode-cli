# FoxCode CLI 测试脚本

Write-Host "=== FoxCode CLI 测试 ===" -ForegroundColor Cyan
Write-Host ""

# 1. 显示帮助
Write-Host "1. 测试帮助命令..." -ForegroundColor Yellow
node dist/index.js --help
Write-Host ""

# 2. 显示版本
Write-Host "2. 测试版本命令..." -ForegroundColor Yellow
node dist/index.js --version
Write-Host ""

# 3. 列出配置（应该为空）
Write-Host "3. 测试列出配置..." -ForegroundColor Yellow
node dist/index.js ls
Write-Host ""

# 4. 查看当前配置（应该为空）
Write-Host "4. 测试查看当前配置..." -ForegroundColor Yellow
node dist/index.js current
Write-Host ""

Write-Host "=== 基础测试完成 ===" -ForegroundColor Green
Write-Host ""
Write-Host "接下来可以手动测试交互式命令:" -ForegroundColor Cyan
Write-Host "  node dist/index.js add    # 添加配置" -ForegroundColor Gray
Write-Host "  node dist/index.js use    # 切换配置" -ForegroundColor Gray
Write-Host "  node dist/index.js remove # 删除配置" -ForegroundColor Gray
