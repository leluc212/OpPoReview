# Setup HTTP methods for Job Post API

# Load config
. ./job-api-config.ps1

Write-Host "Setting up HTTP methods for Job Post API..." -ForegroundColor Cyan

# Function to create method
function Create-Method {
    param($resourceId, $httpMethod, $resourcePath)
    
    Write-Host ""
    Write-Host "Creating $httpMethod method for $resourcePath..." -ForegroundColor Yellow
    
    # Create method without authorizer
    aws apigateway put-method `
        --rest-api-id $apiId `
        --resource-id $resourceId `
        --http-method $httpMethod `
        --authorization-type "NONE" `
        --region $region
    
    # Create integration
    aws apigateway put-integration `
        --rest-api-id $apiId `
        --resource-id $resourceId `
        --http-method $httpMethod `
        --type AWS_PROXY `
        --integration-http-method POST `
        --uri "arn:aws:apigateway:${region}:lambda:path/2015-03-31/functions/${lambdaArn}/invocations" `
        --region $region
    
    Write-Host "✅ $httpMethod method created" -ForegroundColor Green
}

# POST /jobs (create job)
Create-Method $jobsResourceId "POST" "/jobs"

# GET /jobs/{idJob} (get single job)
Create-Method $jobIdResourceId "GET" "/jobs/{idJob}"

# PUT /jobs/{idJob} (update job)
Create-Method $jobIdResourceId "PUT" "/jobs/{idJob}"

# DELETE /jobs/{idJob} (delete job)
Create-Method $jobIdResourceId "DELETE" "/jobs/{idJob}"

# GET /jobs/employer/{employerId} (get employer's jobs)
Create-Method $employerIdResourceId "GET" "/jobs/employer/{employerId}"

# GET /jobs/active (get all active jobs)
Create-Method $activeResourceId "GET" "/jobs/active"

# POST /jobs/{idJob}/views (increment views)
Create-Method $viewsResourceId "POST" "/jobs/{idJob}/views"

# Add Lambda permission
Write-Host ""
Write-Host "Adding Lambda invoke permission..." -ForegroundColor Cyan

aws lambda add-permission `
    --function-name JobPostAPI `
    --statement-id apigateway-job-post `
    --action lambda:InvokeFunction `
    --principal apigateway.amazonaws.com `
    --source-arn "arn:aws:execute-api:${region}:${accountId}:${apiId}/*" `
    --region $region 2>$null

Write-Host "✅ Lambda permission added" -ForegroundColor Green

# Deploy API
Write-Host ""
Write-Host "Deploying API to prod stage..." -ForegroundColor Cyan

aws apigateway create-deployment `
    --rest-api-id $apiId `
    --stage-name prod `
    --description "Added Job Post API endpoints" `
    --region $region

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ Job Post API setup complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "API Endpoint: https://${apiId}.execute-api.${region}.amazonaws.com/prod" -ForegroundColor Cyan
Write-Host ""
Write-Host "Available endpoints:" -ForegroundColor Yellow
Write-Host "  POST   /jobs" -ForegroundColor White
Write-Host "  GET    /jobs/{idJob}" -ForegroundColor White
Write-Host "  PUT    /jobs/{idJob}" -ForegroundColor White
Write-Host "  DELETE /jobs/{idJob}" -ForegroundColor White
Write-Host "  GET    /jobs/employer/{employerId}" -ForegroundColor White
Write-Host "  GET    /jobs/active" -ForegroundColor White
Write-Host "  POST   /jobs/{idJob}/views" -ForegroundColor White
