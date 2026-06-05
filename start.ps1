# ============================================================
# تشغيل منصة الامتثال المالي
# ============================================================
$env:PATH = "C:\Program Files\nodejs;C:\Program Files\PostgreSQL\17\bin;" + $env:PATH
$ROOT = "C:\Users\huawei\OneDrive\المستندات\Desktop\project.my\finaudit-platform"

Write-Host ""
Write-Host "  ╔══════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "  ║      الامتثال المالي — تشغيل         ║" -ForegroundColor Cyan
Write-Host "  ╚══════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# التحقق من PostgreSQL
Write-Host "⏳ التحقق من قاعدة البيانات..." -ForegroundColor Yellow
$pgCheck = & psql -U finaudit -d finaudit_db -c "SELECT 1;" -t 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ PostgreSQL غير متاح — تأكد من تشغيل الخدمة" -ForegroundColor Red
    exit 1
}
Write-Host "✅ PostgreSQL متصل" -ForegroundColor Green

# تشغيل API
$apiScript = @"
`$env:PATH = 'C:\Program Files\nodejs;' + `$env:PATH
`$env:DATABASE_URL = 'postgresql://finaudit:finaudit2026@localhost:5432/finaudit_db'
`$env:JWT_SECRET = 'finaudit-super-secret-jwt-key-2026-ksa'
`$env:JWT_REFRESH_SECRET = 'finaudit-refresh-secret-key-2026-ksa'
`$env:JWT_EXPIRES_IN = '15m'
`$env:JWT_REFRESH_EXPIRES_IN = '7d'
`$env:API_PORT = '3001'
`$env:API_PREFIX = 'api/v1'
`$env:NODE_ENV = 'development'
Set-Location '$ROOT\apps\api'
Write-Host '🤖 API + Claude AI — المنفذ 3001' -ForegroundColor Cyan
npm run dev
"@
$apiScript | Out-File "$env:TEMP\finaudit-api.ps1" -Encoding utf8
Start-Process powershell -ArgumentList "-NoExit -File `"$env:TEMP\finaudit-api.ps1`"" -WindowStyle Normal
Write-Host "✅ API يبدأ على http://localhost:3001" -ForegroundColor Green

Start-Sleep -Seconds 2

# تشغيل Frontend
$webScript = @"
`$env:PATH = 'C:\Program Files\nodejs;' + `$env:PATH
Set-Location '$ROOT\apps\web'
Write-Host '🌐 Frontend — المنفذ 3000' -ForegroundColor Green
npm run dev
"@
$webScript | Out-File "$env:TEMP\finaudit-web.ps1" -Encoding utf8
Start-Process powershell -ArgumentList "-NoExit -File `"$env:TEMP\finaudit-web.ps1`"" -WindowStyle Normal
Write-Host "✅ Frontend يبدأ على http://localhost:3000" -ForegroundColor Green

Write-Host ""
Write-Host "⏳ انتظر 20 ثانية ثم افتح المتصفح..." -ForegroundColor Yellow
Start-Sleep -Seconds 20
Start-Process "http://localhost:3000"
Write-Host "🚀 تم فتح المتصفح!" -ForegroundColor Cyan
