# Add CORS to Admin Employer API
$API_ID = "dlidp35x33"
$REGION = "ap-southeast-1"

Write-Host "Adding CORS to Admin Employer API..." -ForegroundColor Cyan
Write-Host ""

# Get all resources
$resourcesJson = aws apigateway get-resources --rest-api-id $API_ID --region $REGION
$resources = $resourcesJson | ConvertFrom-Json

# Filter admin routes
$adminResources = $resources.items | Where-Object { $_.path -like '/admin/*' }

Write-Host "Found $($adminResources.Count) admin resources" -ForegroundColor Green
Write-Host ""

foreach ($resource in $adminResources) {
    Write-Host "Processing: $($resource.path)" -ForegroundColor Cyan
    $resourceId = $resource.id
    
    # Check if OPTIONS exists
    $optionsExists = $false
    try {
        $null = aws apigateway get-method --rest-api-id $API_ID --resource-id $resourceId --http-method OPTIONS --region $REGION 2>&1
        $optionsExists = $true
        Write-Host "  OPTIONS already exists" -ForegroundColor Yellow
    } catch {
        Write-Host "  Adding OPTIONS method..." -ForegroundColor White
    }
    
    if (-not $optionsExists) {
        # Create OPTIONS method
        aws apigateway put-method --rest-api-id $API_ID --resource-id $resourceId --http-method OPTIONS --authorization-type NONE --region $REGION | Out-Null
        
        # Add method response
        aws apigateway put-method-response --rest-api-id $API_ID --resource-id $resourceId --http-method OPTIONS --status-code 200 --response-parameters "method.response.header.Access-Control-Allow-Headers=false,method.response.header.Access-Control-Allow-Methods=false,method.response.header.Access-Control-Allow-Origin=false" --region $REGION | Out-Null
        
        # Add integration
        aws apigateway put-integration --rest-api-id $API_ID --resource-id $resourceId --http-method OPTIONS --type MOCK --request-templates '{\"application/json\":\"{\\\"statusCode\\\": 200}\"}' --region $REGION | Out-Null
        
        # Add integration response
        aws apigateway put-integration-response --rest-api-id $API_ID --resource-id $resourceId --http-method OPTIONS --status-code 200 --response-parameters '{\"method.response.header.Access-Control-Allow-Headers\":\"'"'"'Content-Type,Authorization'"'"'\",\"method.response.header.Access-Control-Allow-Methods\":\"'"'"'GET,POST,PUT,DELETE,OPTIONS'"'"'\",\"method.response.header.Access-Control-Allow-Origin\":\"'"'"'*'"'"'\"}' --region $REGION | Out-Null
        
        Write-Host "  CORS added successfully" -ForegroundColor Green
    }
    
    Write-Host ""
}

# Deploy
Write-Host "Deploying API..." -ForegroundColor Cyan
aws apigateway create-deployment --rest-api-id $API_ID --stage-name prod --region $REGION | Out-Null

Write-Host ""
Write-Host "CORS configuration complete!" -ForegroundColor Green
Write-Host "API: https://$API_ID.execute-api.$REGION.amazonaws.com/prod" -ForegroundColor Yellow
