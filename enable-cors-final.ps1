# Enable CORS for /jobs endpoint using JSON files

$apiId = "dlidp35x33"
$region = "ap-southeast-1"
$resourceId = "2c18pq"  # /jobs resource

Write-Host "Enabling CORS for /jobs endpoint..." -ForegroundColor Cyan

# Step 1: Delete existing OPTIONS method if exists
Write-Host "Cleaning up existing OPTIONS method..." -ForegroundColor Yellow
aws apigateway delete-method `
    --rest-api-id $apiId `
    --resource-id $resourceId `
    --http-method OPTIONS `
    --region $region 2>$null

# Step 2: Create OPTIONS method
Write-Host "Creating OPTIONS method..." -ForegroundColor Yellow
aws apigateway put-method `
    --rest-api-id $apiId `
    --resource-id $resourceId `
    --http-method OPTIONS `
    --authorization-type NONE `
    --region $region

# Step 3: Create MOCK integration
Write-Host "Creating MOCK integration..." -ForegroundColor Yellow
aws apigateway put-integration `
    --rest-api-id $apiId `
    --resource-id $resourceId `
    --http-method OPTIONS `
    --type MOCK `
    --request-templates file://cors-integration-request.json `
    --region $region

# Step 4: Create method response
Write-Host "Creating method response..." -ForegroundColor Yellow
aws apigateway put-method-response `
    --rest-api-id $apiId `
    --resource-id $resourceId `
    --http-method OPTIONS `
    --status-code 200 `
    --response-parameters file://cors-method-response-params.json `
    --region $region

# Step 5: Create integration response
Write-Host "Creating integration response..." -ForegroundColor Yellow
aws apigateway put-integration-response `
    --rest-api-id $apiId `
    --resource-id $resourceId `
    --http-method OPTIONS `
    --status-code 200 `
    --response-parameters file://cors-integration-response-params.json `
    --region $region

# Step 6: Deploy API
Write-Host ""
Write-Host "Deploying API..." -ForegroundColor Cyan
aws apigateway create-deployment `
    --rest-api-id $apiId `
    --stage-name prod `
    --description "Enable CORS for /jobs" `
    --region $region

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ CORS enabled successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Testing OPTIONS request..." -ForegroundColor Yellow
curl -X OPTIONS "https://dlidp35x33.execute-api.ap-southeast-1.amazonaws.com/prod/jobs" -i

Write-Host ""
Write-Host "Please refresh your browser and try again." -ForegroundColor Cyan
