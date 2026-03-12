# Fix CORS for Quick Job API
Write-Host "=== Fixing CORS for Quick Job API ===" -ForegroundColor Cyan

$apiId = "6zw89pkuxb"
$region = "ap-southeast-1"

Write-Host "`n1. Getting current CORS configuration..." -ForegroundColor Yellow
aws apigatewayv2 get-api --api-id $apiId --query "CorsConfiguration" --output json

Write-Host "`n2. Updating CORS configuration..." -ForegroundColor Yellow
aws apigatewayv2 update-api `
    --api-id $apiId `
    --cors-configuration "AllowOrigins=*,AllowMethods=GET,POST,PUT,DELETE,OPTIONS,AllowHeaders=Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token,MaxAge=3600"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ CORS updated successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to update CORS" -ForegroundColor Red
    exit 1
}

Write-Host "`n3. Verifying CORS configuration..." -ForegroundColor Yellow
aws apigatewayv2 get-api --api-id $apiId --query "CorsConfiguration" --output table

Write-Host "`n=== CORS Fix Complete ===" -ForegroundColor Cyan
Write-Host "API Endpoint: https://$apiId.execute-api.$region.amazonaws.com" -ForegroundColor Green
Write-Host "`nNow try creating a new quick job from the web interface" -ForegroundColor Yellow
