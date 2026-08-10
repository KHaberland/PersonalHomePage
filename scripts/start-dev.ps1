# Локальный запуск backend + frontend + открытие Edge (Windows PowerShell)
# Использование:
#   Set-Location D:\Work_Cursor\PersonalHomePage
#   .\scripts\start-dev.ps1
#
# Важно: запускайте в ЛОКАЛЬНОМ терминале Cursor/Windows, не через Cloud Agent.
# Cloud Agent крутит серверы на удалённой VM — ваш Edge не увидит их localhost.

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$SiteUrl = "http://localhost:3000/ru/"
$AdminUrl = "http://localhost:8000/admin/"

function Test-ServerReady {
    param([string]$Url, [int]$TimeoutSec = 60)
    $deadline = (Get-Date).AddSeconds($TimeoutSec)
    while ((Get-Date) -lt $deadline) {
        try {
            $r = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 2 -MaximumRedirection 5
            if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 400) { return $true }
        } catch {}
        Start-Sleep -Seconds 1
    }
    return $false
}

function Open-Edge {
    param([string]$Url)
    $edge = "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
    if (-not (Test-Path $edge)) {
        $edge = "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe"
    }
    if (Test-Path $edge) {
        Start-Process $edge $Url
    } else {
        Start-Process $Url
    }
}

Write-Host "=== PersonalHomePage: подготовка ===" -ForegroundColor Cyan

if (-not (Test-Path "$Root\.env")) {
    Copy-Item "$Root\.env.example" "$Root\.env"
    Write-Host "Создан .env из .env.example"
}

$envLines = Get-Content "$Root\.env"
$envLines = $envLines | Where-Object { $_ -notmatch '^\s*DATABASE_URL=' }
$envLines | Set-Content "$Root\.env" -Encoding UTF8
Copy-Item "$Root\.env" "$Root\backend\.env" -Force

Set-Location "$Root\backend"
if (-not (Test-Path ".\.venv\Scripts\Activate.ps1")) {
    Write-Host "Создаю venv..."
    python -m venv .venv
}
.\.venv\Scripts\Activate.ps1
pip install -q -r requirements.txt
python manage.py migrate --noinput
if ($LASTEXITCODE -ne 0) {
    Write-Host "ОШИБКА migrate. Выполните: git pull (ветка cursor/fix-startup-media-app-8a81 или main после merge PR #1)" -ForegroundColor Red
    exit 1
}

Set-Location "$Root\frontend"
if (-not (Test-Path ".\node_modules")) {
    npm install
}
Remove-Item -Force -ErrorAction SilentlyContinue ".next\dev\lock"

Write-Host "=== Запуск серверов ===" -ForegroundColor Green

$backendCmd = @"
Set-Location '$Root\backend'
.\.venv\Scripts\Activate.ps1
python manage.py runserver
"@

$frontendCmd = @"
Set-Location '$Root\frontend'
npm run dev
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd
Start-Sleep -Seconds 2
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd

Write-Host "Ожидание frontend на $SiteUrl ..."
if (Test-ServerReady -Url $SiteUrl -TimeoutSec 90) {
    Write-Host "Открываю Edge: $SiteUrl" -ForegroundColor Cyan
    Open-Edge -Url $SiteUrl
    Write-Host "Админка (при необходимости): $AdminUrl" -ForegroundColor DarkGray
} else {
    Write-Host "Frontend не ответил за 90 с. Проверьте окно npm run dev." -ForegroundColor Yellow
    Write-Host "Когда будет Ready — откройте вручную: $SiteUrl" -ForegroundColor Yellow
}
