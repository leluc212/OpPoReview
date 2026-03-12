# Simple CORS fix - Enable CORS on API Gateway

$apiId = "dlidp35x33"
$region = "ap-southeast-1"

Write-Host "Enabling CORS on API Gateway..." -ForegroundColor Cyan

# Enable CORS using AWS CLI
aws apigateway update-rest-api `
    --rest-api-id $apiId `
    --patch-operations "op=add,path=/,value=*" `
    --region $region

# Deploy changes
Write-Host "Deploying changes..." -ForegroundColor Yellow
aws apigateway create-deployment `
    --rest-api-id $apiId `
    --stage-name prod `
    --description "Enable CORS" `
    --region $region

Write-Host "✅ Done! Try again in browser." -ForegroundColor Green
