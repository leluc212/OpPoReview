# Create HTTP API Gateway (v2) for Employer Profile
Write-Host "Creating HTTP API Gateway for Employer Profile..." -ForegroundColor Cyan

$API_NAME = "employer-profile-api"
$REGION = "ap-southeast-1"
$LAMBDA_FUNCTION_NAME = "EmployerProfileAPI"

try {
    # Check if API already exists
    Write-Host "Checking if HTTP API exists..." -ForegroundColor Blue
    $existingApis = aws apigatewayv2 get-apis --query "Items[?Name=='$API_NAME']" --output json | ConvertFrom-Json
    
    if ($existingApis.Items -and $existingApis.Items.Count -gt 0) {
        $API_ID = $existingApis.Items[0].ApiId
        $API_ENDPOINT = $existingApis.Items[0].ApiEndpoint
        Write-Host "HTTP API already exists: $API_ID" -ForegroundColor Green
        Write-Host "Endpoint: $API_ENDPOINT" -ForegroundColor Cyan
    } else {
        # Create HTTP API
        Write-Host "Creating new HTTP API..." -ForegroundColor Blue
        $apiResult = aws apigatewayv2 create-api `
            --name $API_NAME `
            --protocol-type HTTP `
            --target "arn:aws:lambda:$REGION`:$(aws sts get-caller-identity --query Account --output text):function:$LAMBDA_FUNCTION_NAME" `
            --cors-configuration AllowOrigins="*",AllowMethods="GET,POST,PUT,DELETE,OPTIONS",AllowHeaders="Content-Type,Authorization" `
            --output json | ConvertFrom-Json
        
        $API_ID = $apiResult.ApiId
        $API_ENDPOINT = $apiResult.ApiEndpoint
        Write-Host "HTTP API created: $API_ID" -ForegroundColor Green
        Write-Host "Endpoint: $API_ENDPOINT" -ForegroundColor Cyan
    }
    
    # Get Lambda function ARN
    Write-Host "`nGetting Lambda function ARN..." -ForegroundColor Blue
    $lambdaArn = aws lambda get-function --function-name $LAMBDA_FUNCTION_NAME --query 'Configuration.FunctionArn' --output text
    Write-Host "Lambda ARN: $lambdaArn" -ForegroundColor Green
    
    # Create integration
    Write-Host "`nCreating Lambda integration..." -ForegroundColor Blue
    $integrationResult = aws apigatewayv2 create-integration `
        --api-id $API_ID `
        --integration-type AWS_PROXY `
        --integration-method POST `
        --payload-format-version "2.0" `
        --target $lambdaArn `
        --output json 2>&1 | ConvertFrom-Json
    
    $INTEGRATION_ID = $integrationResult.IntegrationId
    Write-Host "Integration created: $INTEGRATION_ID" -ForegroundColor Green
    
    # Create routes
    Write-Host "`nCreating routes..." -ForegroundColor Blue
    
    # GET /profile/{userId}
    aws apigatewayv2 create-route `
        --api-id $API_ID `
        --route-key "GET /profile/{userId}" `
        --target "integrations/$INTEGRATION_ID" `
        --output json | Out-Null
    Write-Host "  - GET /profile/{userId}" -ForegroundColor Green
    
    # POST /profile
    aws apigatewayv2 create-route `
        --api-id $API_ID `
        --route-key "POST /profile" `
        --target "integrations/$INTEGRATION_ID" `
        --output json | Out-Null
    Write-Host "  - POST /profile" -ForegroundColor Green
    
    # PUT /profile/{userId}
    aws apigatewayv2 create-route `
        --api-id $API_ID `
        --route-key "PUT /profile/{userId}" `
        --target "integrations/$INTEGRATION_ID" `
        --output json | Out-Null
    Write-Host "  - PUT /profile/{userId}" -ForegroundColor Green
    
    # DELETE /profile/{userId}
    aws apigatewayv2 create-route `
        --api-id $API_ID `
        --route-key "DELETE /profile/{userId}" `
        --target "integrations/$INTEGRATION_ID" `
        --output json | Out-Null
    Write-Host "  - DELETE /profile/{userId}" -ForegroundColor Green
    
    # OPTIONS /{proxy+} for CORS
    aws apigatewayv2 create-route `
        --api-id $API_ID `
        --route-key "OPTIONS /{proxy+}" `
        --target "integrations/$INTEGRATION_ID" `
        --output json | Out-Null
    Write-Host "  - OPTIONS /{proxy+}" -ForegroundColor Green
    
    # Create default stage
    Write-Host "`nCreating deployment stage..." -ForegroundColor Blue
    aws apigatewayv2 create-stage `
        --api-id $API_ID `
        --stage-name prod `
        --auto-deploy `
        --output json | Out-Null
    Write-Host "Stage 'prod' created" -ForegroundColor Green
    
    # Grant Lambda permission
    Write-Host "`nGranting Lambda permission..." -ForegroundColor Blue
    aws lambda add-permission `
        --function-name $LAMBDA_FUNCTION_NAME `
        --statement-id apigateway-access `
        --action lambda:InvokeFunction `
        --principal apigateway.amazonaws.com `
        --source-arn "arn:aws:execute-api:$REGION`:$(aws sts get-caller-identity --query Account --output text):$API_ID/*/*" `
        --output json 2>&1 | Out-Null
    Write-Host "Lambda permission granted" -ForegroundColor Green
    
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "HTTP API Setup Complete!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "API ID: $API_ID" -ForegroundColor White
    Write-Host "Endpoint: $API_ENDPOINT/prod" -ForegroundColor White
    Write-Host "========================================" -ForegroundColor Cyan
    
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
