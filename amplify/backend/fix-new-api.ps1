# Fix the newly created API
Write-Host "Fixing API Gateway configuration..." -ForegroundColor Cyan

$API_ID = "dlidp35x33"
$REGION = "ap-southeast-1"
$LAMBDA_NAME = "EmployerProfileAPI"

# Get Lambda ARN
$lambdaArn = aws lambda get-function --function-name $LAMBDA_NAME --query 'Configuration.FunctionArn' --output text

# Get resources
$resources = aws apigateway get-resources --rest-api-id $API_ID --output json | ConvertFrom-Json

$profileResource = $resources.items | Where-Object { $_.path -eq "/profile" }
$userIdResource = $resources.items | Where-Object { $_.path -eq "/profile/{userId}" }

Write-Host "Profile resource: $($profileResource.id)" -ForegroundColor Gray
Write-Host "UserId resource: $($userIdResource.id)" -ForegroundColor Gray

# Fix PUT method
Write-Host "`nFixing PUT /profile/{userId}..." -ForegroundColor Yellow
aws apigateway put-method `
    --rest-api-id $API_ID `
    --resource-id $userIdResource.id `
    --http-method PUT `
    --authorization-type NONE `
    --output json 2>&1 | Out-Null

aws apigateway put-integration `
    --rest-api-id $API_ID `
    --resource-id $userIdResource.id `
    --http-method PUT `
    --type AWS_PROXY `
    --integration-http-method POST `
    --uri "arn:aws:apigateway:${REGION}:lambda:path/2015-03-31/functions/$lambdaArn/invocations" `
    --output json 2>&1 | Out-Null

Write-Host "PUT method fixed" -ForegroundColor Green

# Fix DELETE method
Write-Host "`nFixing DELETE /profile/{userId}..." -ForegroundColor Yellow
aws apigateway put-method `
    --rest-api-id $API_ID `
    --resource-id $userIdResource.id `
    --http-method DELETE `
    --authorization-type NONE `
    --output json 2>&1 | Out-Null

aws apigateway put-integration `
    --rest-api-id $API_ID `
    --resource-id $userIdResource.id `
    --http-method DELETE `
    --type AWS_PROXY `
    --integration-http-method POST `
    --uri "arn:aws:apigateway:${REGION}:lambda:path/2015-03-31/functions/$lambdaArn/invocations" `
    --output json 2>&1 | Out-Null

Write-Host "DELETE method fixed" -ForegroundColor Green

# Add OPTIONS for CORS - simpler approach
Write-Host "`nAdding OPTIONS methods for CORS..." -ForegroundColor Yellow

foreach ($resource in @($profileResource, $userIdResource)) {
    Write-Host "  Adding OPTIONS to $($resource.path)" -ForegroundColor Gray
    
    # Put method
    aws apigateway put-method `
        --rest-api-id $API_ID `
        --resource-id $resource.id `
        --http-method OPTIONS `
        --authorization-type NONE `
        --output json 2>&1 | Out-Null
    
    # Put integration - MOCK type
    aws apigateway put-integration `
        --rest-api-id $API_ID `
        --resource-id $resource.id `
        --http-method OPTIONS `
        --type MOCK `
        --request-templates '{"application/json":"{\"statusCode\":200}"}' `
        --output json 2>&1 | Out-Null
    
    # Put method response
    aws apigateway put-method-response `
        --rest-api-id $API_ID `
        --resource-id $resource.id `
        --http-method OPTIONS `
        --status-code 200 `
        --response-models '{"application/json":"Empty"}' `
        --response-parameters '{"method.response.header.Access-Control-Allow-Headers":false,"method.response.header.Access-Control-Allow-Methods":false,"method.response.header.Access-Control-Allow-Origin":false}' `
        --output json 2>&1 | Out-Null
    
    # Put integration response
    aws apigateway put-integration-response `
        --rest-api-id $API_ID `
        --resource-id $resource.id `
        --http-method OPTIONS `
        --status-code 200 `
        --response-parameters '{"method.response.header.Access-Control-Allow-Headers":"'"'"'Content-Type,Authorization'"'"'","method.response.header.Access-Control-Allow-Methods":"'"'"'GET,POST,PUT,DELETE,OPTIONS'"'"'","method.response.header.Access-Control-Allow-Origin":"'"'"'*'"'"'"}' `
        --output json 2>&1 | Out-Null
}

Write-Host "OPTIONS methods added" -ForegroundColor Green

# Deploy API
Write-Host "`nDeploying API..." -ForegroundColor Yellow
$deployment = aws apigateway create-deployment `
    --rest-api-id $API_ID `
    --stage-name prod `
    --stage-description "Fixed deployment" `
    --output json | ConvertFrom-Json

Write-Host "Deployment created: $($deployment.id)" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "API Fixed!" -ForegroundColor Green
Write-Host "API URL: https://$API_ID.execute-api.$REGION.amazonaws.com/prod" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
