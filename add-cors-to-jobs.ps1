# Add CORS support to job endpoints

. ./job-api-config.ps1

Write-Host "Adding CORS support to job endpoints..." -ForegroundColor Cyan

function Add-CORS {
    param($resourceId, $resourcePath)
    
    Write-Host ""
    Write-Host "Adding OPTIONS method to $resourcePath..." -ForegroundColor Yellow
    
    # Create OPTIONS method
    aws apigateway put-method `
        --rest-api-id $apiId `
        --resource-id $resourceId `
        --http-method OPTIONS `
        --authorization-type NONE `
        --region $region
    
    # Create mock integration
    aws apigateway put-integration `
        --rest-api-id $apiId `
        --resource-id $resourceId `
        --http-method OPTIONS `
        --type MOCK `
        --request-templates '{"application/json":"{\"statusCode\":200}"}' `
        --region $region
    
    # Create method response
    aws apigateway put-method-response `
        --rest-api-id $apiId `
        --resource-id $resourceId `
        --http-method OPTIONS `
        --status-code 200 `
        --response-parameters "method.response.header.Access-Control-Allow-Headers=false,method.response.header.Access-Control-Allow-Methods=false,method.response.header.Access-Control-Allow-Origin=false" `
        --region $region
    
    # Create integration response
    aws apigateway put-integration-response `
        --rest-api-id $apiId `
        --resource-id $resourceId `
        --http-method OPTIONS `
        --status-code 200 `
        --response-parameters '{\"method.response.header.Access-Control-Allow-Headers\":\"'"'"'Content-Type,Authorization'"'"'\",\"method.response.header.Access-Control-Allow-Methods\":\"'"'"'GET,POST,PUT,DELETE,OPTIONS'"'"'\",\"method.response.header.Access-Control-Allow-Origin\":\"'"'"'*'"'"'\"}' `
        --region $region
    
    Write-Host "✅ CORS added to $resourcePath" -ForegroundColor Green
}

# Add CORS to all resources
Add-CORS $jobsResourceId "/jobs"
Add-CORS $jobIdResourceId "/jobs/{idJob}"
Add-CORS $employerIdResourceId "/jobs/employer/{employerId}"
Add-CORS $activeResourceId "/jobs/active"
Add-CORS $viewsResourceId "/jobs/{idJob}/views"

# Deploy API
Write-Host ""
Write-Host "Deploying API..." -ForegroundColor Cyan
aws apigateway create-deployment `
    --rest-api-id $apiId `
    --stage-name prod `
    --description "Added CORS support" `
    --region $region

Write-Host ""
Write-Host "✅ CORS support added successfully!" -ForegroundColor Green
