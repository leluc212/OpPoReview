# Add Admin routes to API Gateway
# This script adds admin endpoints to the existing API Gateway

Write-Host "🔧 Adding Admin Routes to API Gateway" -ForegroundColor Cyan
Write-Host ""

$API_ID = "dlidp35x33"  # Your API Gateway ID
$REGION = "ap-southeast-1"

Write-Host "API Gateway ID: $API_ID" -ForegroundColor Yellow
Write-Host "Region: $REGION" -ForegroundColor Yellow
Write-Host ""

# Get root resource
Write-Host "📍 Getting API resources..." -ForegroundColor Yellow
$resources = aws apigateway get-resources `
    --rest-api-id $API_ID `
    --region $REGION `
    --output json | ConvertFrom-Json

$rootId = ($resources.items | Where-Object { $_.path -eq "/" }).id
Write-Host "Root resource ID: $rootId" -ForegroundColor Green
Write-Host ""

# Create /admin resource
Write-Host "➕ Creating /admin resource..." -ForegroundColor Yellow
$adminResource = aws apigateway create-resource `
    --rest-api-id $API_ID `
    --parent-id $rootId `
    --path-part "admin" `
    --region $REGION `
    --output json | ConvertFrom-Json

$adminId = $adminResource.id
Write-Host "Admin resource ID: $adminId" -ForegroundColor Green
Write-Host ""

# Create /admin/employers resource
Write-Host "➕ Creating /admin/employers resource..." -ForegroundColor Yellow

$employersResource = aws apigateway create-resource `
    --rest-api-id $API_ID `
    --parent-id $adminId `
    --path-part "employers" `
    --region $REGION `
    --output json | ConvertFrom-Json

$employersId = $employersResource.id
Write-Host "Employers resource ID: $employersId" -ForegroundColor Green
Write-Host ""

# Add GET method to /admin/employers
Write-Host "➕ Adding GET method to /admin/employers..." -ForegroundColor Yellow
aws apigateway put-method `
    --rest-api-id $API_ID `
    --resource-id $employersId `
    --http-method GET `
    --authorization-type "COGNITO_USER_POOLS" `
    --authorizer-id "YOUR_AUTHORIZER_ID" `
    --region $REGION

Write-Host "✅ Admin routes structure created!" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️ Important: You need to:" -ForegroundColor Yellow
Write-Host "  1. Configure method integration for each endpoint" -ForegroundColor White
Write-Host "  2. Deploy the API to 'prod' stage" -ForegroundColor White
Write-Host "  3. Test the endpoints" -ForegroundColor White
Write-Host ""
Write-Host "Or use AWS Console to complete the setup:" -ForegroundColor Cyan
Write-Host "  https://console.aws.amazon.com/apigateway" -ForegroundColor White
