$API_ID = "xyp4wkszi7"
$REGION = "ap-southeast-1"
$STAGE = "prod"

Write-Host "Configuring CORS with full headers..." -ForegroundColor Cyan
Write-Host ""

# Get resources
$resourcesJson = aws apigateway get-resources --rest-api-id $API_ID --region $REGION
$resources = $resourcesJson | ConvertFrom-Json

foreach ($resource in $resources.items) {
    $resourceId = $resource.id
    $path = $resource.path
    
    Write-Host "Configuring: $path" -ForegroundColor Cyan
    
    # Delete existing OPTIONS if exists
    try {
        aws apigateway delete-method --rest-api-id $API_ID --resource-id $resourceId --http-method OPTIONS --region $REGION 2>&1 | Out-Null
        Write-Host "  Deleted old OPTIONS" -ForegroundColor Yellow
    } catch {}
    
    # Create OPTIONS method
    aws apigateway put-method --rest-api-id $API_ID --resource-id $resourceId --http-method OPTIONS --authorization-type NONE --region $REGION 2>&1 | Out-Null
    
    # Create mock integration with proper request template
    $requestTemplate = '{"application/json": "{\"statusCode\": 200}"}'
    aws apigateway put-integration --rest-api-id $API_ID --resource-id $resourceId --http-method OPTIONS --type MOCK --request-templates $requestTemplate --region $REGION 2>&1 | Out-Null
    
    # Create method response with CORS headers
    $responseParams = "method.response.header.Access-Control-Allow-Headers=false,method.response.header.Access-Control-Allow-Methods=false,method.response.header.Access-Control-Allow-Origin=false"
    aws apigateway put-method-response --rest-api-id $API_ID --resource-id $resourceId --http-method OPTIONS --status-code 200 --response-parameters $responseParams --region $REGION 2>&1 | Out-Null
    
    # Create integration response with actual CORS header values
    $integrationParams = @{
        "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
        "method.response.header.Access-Control-Allow-Methods" = "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'"
        "method.response.header.Access-Control-Allow-Origin" = "'*'"
    }
    $integrationParamsJson = $integrationParams | ConvertTo-Json -Compress
    
    aws apigateway put-integration-response --rest-api-id $API_ID --resource-id $resourceId --http-method OPTIONS --status-code 200 --response-parameters $integrationParamsJson --region $REGION 2>&1 | Out-Null
    
    Write-Host "  Configured OPTIONS with CORS" -ForegroundColor Green
    
    # Also update other methods to include CORS in responses
    if ($resource.resourceMethods) {
        $methods = $resource.resourceMethods | Get-Member -MemberType NoteProperty | Select-Object -ExpandProperty Name
        foreach ($method in $methods) {
            if ($method -ne "OPTIONS") {
                Write-Host "  Updating $method..." -ForegroundColor Yellow
                
                # Add CORS header to method response
                try {
                    aws apigateway put-method-response --rest-api-id $API_ID --resource-id $resourceId --http-method $method --status-code 200 --response-parameters "method.response.header.Access-Control-Allow-Origin=false" --region $REGION 2>&1 | Out-Null
                } catch {}
                
                # Update integration response to include CORS header
                try {
                    $methodIntegrationParams = @{
                        "method.response.header.Access-Control-Allow-Origin" = "'*'"
                    }
                    $methodIntegrationParamsJson = $methodIntegrationParams | ConvertTo-Json -Compress
                    
                    aws apigateway put-integration-response --rest-api-id $API_ID --resource-id $resourceId --http-method $method --status-code 200 --response-parameters $methodIntegrationParamsJson --region $REGION 2>&1 | Out-Null
                    Write-Host "    Added CORS to $method" -ForegroundColor Green
                } catch {
                    Write-Host "    Could not update $method" -ForegroundColor Gray
                }
            }
        }
    }
}

Write-Host ""
Write-Host "Deploying to production..." -ForegroundColor Cyan
aws apigateway create-deployment --rest-api-id $API_ID --stage-name $STAGE --description "Full CORS configuration" --region $REGION 2>&1 | Out-Null

Write-Host ""
Write-Host "CORS configuration complete!" -ForegroundColor Green
Write-Host "Please wait 10 seconds for deployment to propagate, then refresh your browser." -ForegroundColor Yellow
