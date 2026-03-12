$API_ID = "xyp4wkszi7"
$REGION = "ap-southeast-1"
$STAGE = "prod"

Write-Host "Enabling CORS for API Gateway" -ForegroundColor Cyan
Write-Host "API ID: $API_ID" -ForegroundColor Yellow
Write-Host ""

# Get resources
$resourcesJson = aws apigateway get-resources --rest-api-id $API_ID --region $REGION
$resources = $resourcesJson | ConvertFrom-Json

Write-Host "Found resources: $($resources.items.Count)" -ForegroundColor Green
Write-Host ""

# Enable CORS on each resource
foreach ($resource in $resources.items) {
    $resourceId = $resource.id
    $path = $resource.path
    
    Write-Host "Resource: $path" -ForegroundColor Cyan
    
    # Check for OPTIONS method
    $hasOptions = $false
    if ($resource.resourceMethods) {
        $methods = $resource.resourceMethods | Get-Member -MemberType NoteProperty | Select-Object -ExpandProperty Name
        $hasOptions = $methods -contains "OPTIONS"
    }
    
    if (-not $hasOptions) {
        Write-Host "  Adding OPTIONS..." -ForegroundColor Yellow
        
        # Put method
        aws apigateway put-method --rest-api-id $API_ID --resource-id $resourceId --http-method OPTIONS --authorization-type NONE --region $REGION 2>&1 | Out-Null
        
        # Put integration
        aws apigateway put-integration --rest-api-id $API_ID --resource-id $resourceId --http-method OPTIONS --type MOCK --region $REGION 2>&1 | Out-Null
        
        # Put method response
        aws apigateway put-method-response --rest-api-id $API_ID --resource-id $resourceId --http-method OPTIONS --status-code 200 --region $REGION 2>&1 | Out-Null
        
        # Put integration response
        aws apigateway put-integration-response --rest-api-id $API_ID --resource-id $resourceId --http-method OPTIONS --status-code 200 --region $REGION 2>&1 | Out-Null
        
        Write-Host "  Done" -ForegroundColor Green
    }
    else {
        Write-Host "  OPTIONS exists" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "Deploying..." -ForegroundColor Cyan
aws apigateway create-deployment --rest-api-id $API_ID --stage-name $STAGE --region $REGION 2>&1 | Out-Null

Write-Host "Complete!" -ForegroundColor Green
