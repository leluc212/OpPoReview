# Fix CORS for API Gateway
# This script updates the API Gateway to allow CORS from localhost

$API_ID = "xyp4wkszi7"
$REGION = "ap-southeast-1"
$STAGE = "prod"

Write-Host "Fixing CORS for API Gateway..." -ForegroundColor Cyan
Write-Host "API ID: $API_ID" -ForegroundColor Yellow
Write-Host "Region: $REGION" -ForegroundColor Yellow
Write-Host ""

# Get all resources
Write-Host "Getting API resources..." -ForegroundColor White
$resources = aws apigateway get-resources --rest-api-id $API_ID --region $REGION | ConvertFrom-Json

foreach ($resource in $resources.items) {
    $resourceId = $resource.id
    $path = $resource.path
    
    Write-Host "Processing resource: $path (ID: $resourceId)" -ForegroundColor Cyan
    
    # Check if OPTIONS method exists
    $hasOptions = $false
    if ($resource.resourceMethods) {
        $hasOptions = $resource.resourceMethods.PSObject.Properties.Name -contains "OPTIONS"
    }
    
    if (-not $hasOptions) {
        Write-Host "  Creating OPTIONS method..." -ForegroundColor Yellow
        
        # Create OPTIONS method
        try {
            aws apigateway put-method `
                --rest-api-id $API_ID `
                --resource-id $resourceId `
                --http-method OPTIONS `
                --authorization-type NONE `
                --region $REGION | Out-Null
            
            # Create mock integration
            aws apigateway put-integration `
                --rest-api-id $API_ID `
                --resource-id $resourceId `
                --http-method OPTIONS `
                --type MOCK `
                --request-templates '{"application/json":"{\"statusCode\": 200}"}' `
                --region $REGION | Out-Null
            
            # Create method response
            aws apigateway put-method-response `
                --rest-api-id $API_ID `
                --resource-id $resourceId `
                --http-method OPTIONS `
                --status-code 200 `
                --response-parameters "method.response.header.Access-Control-Allow-Headers=false,method.response.header.Access-Control-Allow-Methods=false,method.response.header.Access-Control-Allow-Origin=false" `
                --region $REGION | Out-Null
            
            # Create integration response with CORS headers
            $corsHeaders = @{
                "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
                "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,PUT,DELETE,OPTIONS'"
                "method.response.header.Access-Control-Allow-Origin" = "'*'"
            }
            $corsHeadersJson = $corsHeaders | ConvertTo-Json -Compress
            
            aws apigateway put-integration-response `
                --rest-api-id $API_ID `
                --resource-id $resourceId `
                --http-method OPTIONS `
                --status-code 200 `
                --response-parameters $corsHeadersJson `
                --region $REGION | Out-Null
            
            Write-Host "  ✅ OPTIONS method created" -ForegroundColor Green
        } catch {
            Write-Host "  ⚠️  Error creating OPTIONS: $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "  ℹ️  OPTIONS method already exists" -ForegroundColor Gray
    }
    
    # Update existing methods to include CORS headers
    if ($resource.resourceMethods) {
        foreach ($method in $resource.resourceMethods.PSObject.Properties.Name) {
            if ($method -ne "OPTIONS") {
                Write-Host "  Updating $method method response..." -ForegroundColor Yellow
                
                try {
                    # Try to create method response with CORS headers
                    aws apigateway put-method-response `
                        --rest-api-id $API_ID `
                        --resource-id $resourceId `
                        --http-method $method `
                        --status-code 200 `
                        --response-parameters "method.response.header.Access-Control-Allow-Origin=false" `
                        --region $REGION 2>$null | Out-Null
                    
                    Write-Host "  ✅ $method method response updated" -ForegroundColor Green
                } catch {
                    Write-Host "  ℹ️  $method method response already configured" -ForegroundColor Gray
                }
            }
        }
    }
}

Write-Host ""
Write-Host "Deploying changes..." -ForegroundColor Cyan
aws apigateway create-deployment `
    --rest-api-id $API_ID `
    --stage-name $STAGE `
    --description "CORS fix deployment" `
    --region $REGION | Out-Null

Write-Host "✅ CORS configuration updated and deployed!" -ForegroundColor Green
Write-Host ""
Write-Host "API URL: https://$API_ID.execute-api.$REGION.amazonaws.com/$STAGE" -ForegroundColor Cyan
