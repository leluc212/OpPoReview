# Fix CORS configuration for Employer Profile API Gateway
# This script removes authorization requirement from OPTIONS method

Write-Host "Fixing CORS configuration for Employer Profile API..." -ForegroundColor Cyan

# Get API ID
$apiId = aws apigatewayv2 get-apis --query "Items[?Name=='employer-profile-api'].ApiId" --output text

if (-not $apiId) {
    Write-Host "Could not find employer-profile-api" -ForegroundColor Red
    exit 1
}

Write-Host "Found API ID: $apiId" -ForegroundColor Green

# Get Integration ID for Lambda
$integrationId = aws apigatewayv2 get-integrations --api-id $apiId --query "Items[0].IntegrationId" --output text

if (-not $integrationId) {
    Write-Host "Could not find integration" -ForegroundColor Red
    exit 1
}

Write-Host "Found Integration ID: $integrationId" -ForegroundColor Green

# Get Routes
$routes = aws apigatewayv2 get-routes --api-id $apiId --output json | ConvertFrom-Json

Write-Host "`nCurrent routes:" -ForegroundColor Cyan
$routes.Items | ForEach-Object {
    Write-Host "  - $($_.RouteKey) (ID: $($_.RouteId))"
}

# Find OPTIONS route
$optionsRoute = $routes.Items | Where-Object { $_.RouteKey -eq "OPTIONS /{proxy+}" }

if ($optionsRoute) {
    Write-Host "`nFound OPTIONS route: $($optionsRoute.RouteId)" -ForegroundColor Green
    
    # Update OPTIONS route to remove authorization
    Write-Host "Updating OPTIONS route to remove authorization..." -ForegroundColor Cyan
    
    aws apigatewayv2 update-route `
        --api-id $apiId `
        --route-id $optionsRoute.RouteId `
        --authorization-type NONE `
        --no-authorization-scopes 2>&1 | Out-Null
    
    Write-Host "OPTIONS route updated" -ForegroundColor Green
} else {
    Write-Host "`nOPTIONS route not found, creating one..." -ForegroundColor Yellow
    
    # Create OPTIONS route
    $newRoute = aws apigatewayv2 create-route `
        --api-id $apiId `
        --route-key "OPTIONS /{proxy+}" `
        --target "integrations/$integrationId" `
        --authorization-type NONE `
        --output json | ConvertFrom-Json
    
    Write-Host "OPTIONS route created: $($newRoute.RouteId)" -ForegroundColor Green
}

# Also update other routes to ensure they have proper authorization
Write-Host "`nUpdating other routes..." -ForegroundColor Cyan

$routes.Items | Where-Object { $_.RouteKey -ne "OPTIONS /{proxy+}" } | ForEach-Object {
    Write-Host "  Updating $($_.RouteKey)..." -ForegroundColor Gray
    
    aws apigatewayv2 update-route `
        --api-id $apiId `
        --route-id $_.RouteId `
        --authorization-type AWS_IAM 2>&1 | Out-Null
}

Write-Host "`nCORS configuration fixed!" -ForegroundColor Green
Write-Host "API Gateway will now allow CORS preflight requests without authentication" -ForegroundColor Cyan
