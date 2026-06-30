# PowerShell script to add GET /applications/available-workers/{jobId} route to API Gateway HTTP API
$ErrorActionPreference = "Continue"

$API_ID       = "l1636ie205"
$INTEGRATION  = "jjduf5i"     # ApplicationLambda integration
$AUTHORIZER   = "w7g6id"      # CognitoAuthorizer
$REGION       = "ap-southeast-1"
$ROUTE_KEY    = "GET /applications/available-workers/{jobId}"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Adding route: $ROUTE_KEY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`n[1/2] Creating route in API Gateway..." -ForegroundColor Yellow
$result = aws apigatewayv2 create-route `
    --api-id $API_ID `
    --route-key $ROUTE_KEY `
    --target "integrations/$INTEGRATION" `
    --authorization-type JWT `
    --authorizer-id $AUTHORIZER `
    --region $REGION

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Route created successfully!" -ForegroundColor Green
    Write-Host $result
} else {
    Write-Host "❌ Failed to create route (it may already exist). Output:" -ForegroundColor Red
    Write-Host $result
    exit 1
}

Write-Host "`n[2/2] Done! The new route is active immediately (HTTP APIs auto-deploy)." -ForegroundColor Green
Write-Host "`nIMPORTANT: Also run update-application-lambda.ps1 if the Lambda code was changed." -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
