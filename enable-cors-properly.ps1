# Enable CORS properly for /jobs endpoints

$apiId = "dlidp35x33"
$region = "ap-southeast-1"

Write-Host "Enabling CORS for /jobs endpoints..." -ForegroundColor Cyan

# Function to enable CORS for a resource
function Enable-CORS-For-Resource {
    param($resourceId, $resourcePath)
    
    Write-Host ""
    Write-Host "Processing $resourcePath..." -ForegroundColor Yellow
    
    # Delete existing OPTIONS method if exists
    aws apigateway delete-method `
        --rest-api-id $apiId `
        --resource-id $resourceId `
        --http-method OPTIONS `
        --region $region 2>$null
    
    # Create OPTIONS method
    aws apigateway put-method `
        --rest-api-id $apiId `
        --resource-id $resourceId `
        --http-method OPTIONS `
        --authorization-type NONE `
        --region $region | Out-Null
    
    # Create MOCK integration
    aws apigateway put-integration `
        --rest-api-id $apiId `
        --resource-id $resourceId `
        --http-method OPTIONS `
        --type MOCK `
        --request-templates '{\"application/json\":\"{\\\"statusCode\\\": 200}\"}' `
        --region $region | Out-Null
    
    # Create method response
    aws apigateway put-method-response `
        --rest-api-id $apiId `
        --resource-id $resourceId `
        --http-method OPTIONS `
        --status-code 200 `
        --response-models '{\"application/json\":\"Empty\"}' `
        --response-parameters '{\"method.response.header.Access-Control-Allow-Headers\":false,\"method.response.header.Access-Control-Allow-Methods\":false,\"method.response.header.Access-Control-Allow-Origin\":false}' `
        --region $region | Out-Null
    
    # Create integration response with CORS headers
    aws apigateway put-integration-response `
        --rest-api-id $apiId `
        --resource-id $resourceId `
        --http-method OPTIONS `
        --status-code 200 `
        --response-parameters '{\"method.response.header.Access-Control-Allow-Headers\":\"'"'"'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"'"'\",\"method.response.header.Access-Control-Allow-Methods\":\"'"'"'GET,POST,PUT,DELETE,OPTIONS'"'"'\",\"method.response.header.Access-Control-Allow-Origin\":\"'"'"'*'"'"'\"}' `
        --region $region | Out-Null
    
    Write-Host "✅ CORS enabled for $resourcePath" -ForegroundColor Green
}

# Enable CORS for all job endpoints
Enable-CORS-For-Resource "2c18pq" "/jobs"
Enable-CORS-For-Resource "tirchz" "/jobs/{idJob}"
Enable-CORS-For-Resource "pieznv" "/jobs/employer/{employerId}"
Enable-CORS-For-Resource "cepymp" "/jobs/active"
Enable-CORS-For-Resource "lbpl8x" "/jobs/{idJob}/views"

# Deploy API
Write-Host ""
Write-Host "Deploying API..." -ForegroundColor Cyan
aws apigateway create-deployment `
    --rest-api-id $apiId `
    --stage-name prod `
    --description "Enable CORS for job endpoints" `
    --region $region | Out-Null

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ CORS enabled successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Please refresh your browser and try again." -ForegroundColor Yellow
