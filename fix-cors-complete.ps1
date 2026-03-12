# Complete CORS fix for ALL job endpoints
$apiId = "dlidp35x33"
$region = "ap-southeast-1"

Write-Host "🔧 Fixing CORS for ALL job endpoints..." -ForegroundColor Cyan
Write-Host ""

# Resource IDs
$resources = @{
    "/jobs" = "2c18pq"
    "/jobs/active" = "cepymp"
    "/jobs/employer/{employerId}" = "pieznv"
    "/jobs/{idJob}" = "tirchz"
    "/jobs/{idJob}/views" = "lbpl8x"
}

foreach ($path in $resources.Keys) {
    $resourceId = $resources[$path]
    
    Write-Host "📍 Configuring CORS for: $path (ID: $resourceId)" -ForegroundColor Yellow
    
    # Delete existing OPTIONS method (ignore errors)
    aws apigateway delete-method --rest-api-id $apiId --resource-id $resourceId --http-method OPTIONS --region $region 2>$null
    
    # Create OPTIONS method
    Write-Host "  ✓ Creating OPTIONS method..." -ForegroundColor Gray
    aws apigateway put-method --rest-api-id $apiId --resource-id $resourceId --http-method OPTIONS --authorization-type NONE --region $region | Out-Null
    
    # Add MOCK integration
    Write-Host "  ✓ Adding MOCK integration..." -ForegroundColor Gray
    aws apigateway put-integration --rest-api-id $apiId --resource-id $resourceId --http-method OPTIONS --type MOCK --request-templates file://cors-integration-request.json --region $region | Out-Null
    
    # Add method response
    Write-Host "  ✓ Adding method response..." -ForegroundColor Gray
    aws apigateway put-method-response --rest-api-id $apiId --resource-id $resourceId --http-method OPTIONS --status-code 200 --response-parameters file://cors-method-response-params.json --region $region | Out-Null
    
    # Add integration response
    Write-Host "  ✓ Adding integration response..." -ForegroundColor Gray
    aws apigateway put-integration-response --rest-api-id $apiId --resource-id $resourceId --http-method OPTIONS --status-code 200 --response-parameters file://cors-integration-response-params.json --region $region | Out-Null
    
    Write-Host "  ✅ CORS configured for $path" -ForegroundColor Green
    Write-Host ""
}

# Deploy changes
Write-Host "🚀 Deploying changes to prod stage..." -ForegroundColor Cyan
aws apigateway create-deployment --rest-api-id $apiId --stage-name prod --description "Complete CORS fix for all job endpoints" --region $region | Out-Null

Write-Host ""
Write-Host "✅ CORS configuration complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Configured endpoints:" -ForegroundColor Cyan
foreach ($path in $resources.Keys) {
    Write-Host "  • $path" -ForegroundColor White
}
Write-Host ""
Write-Host "🧪 Test the API now in your browser!" -ForegroundColor Yellow
