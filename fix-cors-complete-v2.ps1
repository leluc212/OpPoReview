# Complete CORS fix for Quick Job API
Write-Host "=== Complete CORS Fix for Quick Job API ===" -ForegroundColor Cyan

$apiId = "6zw89pkuxb"
$region = "ap-southeast-1"

Write-Host "`n1. Current CORS Configuration:" -ForegroundColor Yellow
aws apigatewayv2 get-api --api-id $apiId --query "CorsConfiguration" --output json

Write-Host "`n2. Updating CORS with all required headers..." -ForegroundColor Yellow

# Update CORS configuration
$corsConfig = @{
    AllowOrigins = @("*")
    AllowMethods = @("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
    AllowHeaders = @(
        "content-type",
        "authorization", 
        "x-amz-date",
        "x-api-key",
        "x-amz-security-token",
        "x-amz-user-agent"
    )
    ExposeHeaders = @(
        "content-type",
        "x-amz-request-id"
    )
    MaxAge = 3600
    AllowCredentials = $false
}

$corsJson = $corsConfig | ConvertTo-Json -Compress

# Create temp file for CORS config
$corsJson | Out-File -FilePath "cors-config-temp.json" -Encoding utf8 -NoNewline

# Update API with new CORS
aws apigatewayv2 update-api `
    --api-id $apiId `
    --cors-configuration "AllowOrigins=*,AllowMethods=GET,POST,PUT,DELETE,OPTIONS,PATCH,AllowHeaders=content-type,authorization,x-amz-date,x-api-key,x-amz-security-token,x-amz-user-agent,ExposeHeaders=content-type,x-amz-request-id,MaxAge=3600,AllowCredentials=false" `
    --output json | ConvertFrom-Json | Select-Object ApiId, Name, CorsConfiguration | ConvertTo-Json -Depth 10

Remove-Item -Path "cors-config-temp.json" -ErrorAction SilentlyContinue

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ CORS configuration updated successfully" -ForegroundColor Green
} else {
    Write-Host "`n❌ Failed to update CORS configuration" -ForegroundColor Red
    exit 1
}

Write-Host "`n3. Verifying CORS Configuration:" -ForegroundColor Yellow
aws apigatewayv2 get-api --api-id $apiId --query "CorsConfiguration" --output table

Write-Host "`n4. Testing CORS with curl..." -ForegroundColor Yellow
Write-Host "Testing OPTIONS request..." -ForegroundColor White

$optionsTest = curl -X OPTIONS `
    "https://$apiId.execute-api.$region.amazonaws.com/quick-jobs" `
    -H "Origin: http://localhost:3000" `
    -H "Access-Control-Request-Method: POST" `
    -H "Access-Control-Request-Headers: content-type" `
    -v 2>&1

Write-Host $optionsTest

Write-Host "`n=== CORS Fix Complete ===" -ForegroundColor Cyan
Write-Host "`nAPI Endpoint: https://$apiId.execute-api.$region.amazonaws.com" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Open test-cors-simple.html in browser" -ForegroundColor White
Write-Host "2. Click 'Test OPTIONS' to verify preflight" -ForegroundColor White
Write-Host "3. Click 'Test POST' to create a job" -ForegroundColor White
Write-Host "4. Refresh your web app and try creating a job" -ForegroundColor White
