# PowerShell script to update API URL in quickJobService.js
# Run this after creating the API to automatically update the service file

Write-Host "🔄 Updating Quick Job Service with API URL..." -ForegroundColor Cyan

# Check if config file exists
if (-not (Test-Path "quick-job-api-config.json")) {
    Write-Host "❌ Configuration file not found!" -ForegroundColor Red
    Write-Host "Please run create-quick-job-api.ps1 first" -ForegroundColor Yellow
    exit 1
}

# Read API endpoint from config
$config = Get-Content "quick-job-api-config.json" | ConvertFrom-Json
$API_ENDPOINT = $config.apiEndpoint

Write-Host "📋 API Endpoint: $API_ENDPOINT" -ForegroundColor Yellow

# Update quickJobService.js
$SERVICE_FILE = "src/services/quickJobService.js"

if (-not (Test-Path $SERVICE_FILE)) {
    Write-Host "❌ Service file not found: $SERVICE_FILE" -ForegroundColor Red
    exit 1
}

# Read file content
$content = Get-Content $SERVICE_FILE -Raw

# Replace the API_BASE_URL
$pattern = "const API_BASE_URL = '[^']*';"
$replacement = "const API_BASE_URL = '$API_ENDPOINT';"

$newContent = $content -replace $pattern, $replacement

# Write back to file
$newContent | Out-File -FilePath $SERVICE_FILE -Encoding utf8 -NoNewline

Write-Host "✅ Service file updated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Updated line:" -ForegroundColor Cyan
Write-Host "  const API_BASE_URL = '$API_ENDPOINT';" -ForegroundColor Yellow
Write-Host ""
Write-Host "🎉 Quick Job Service is now connected to the API!" -ForegroundColor Green
