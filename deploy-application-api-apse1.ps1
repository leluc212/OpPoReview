# Deploy Application API to ap-southeast-1

Write-Host "Deploying Application API to ap-southeast-1..." -ForegroundColor Cyan

$REGION = "ap-southeast-1"
$LAMBDA_NAME = "ApplicationLambda"
$API_NAME = "ApplicationAPI"

# Step 1: Check if Lambda exists in ap-southeast-1
Write-Host "`nStep 1: Checking Lambda in ap-southeast-1..." -ForegroundColor Yellow
$lambdaCheck = aws lambda get-function --function-name $LAMBDA_NAME --region $REGION 2>$null

if ($lambdaCheck) {
    Write-Host "Lambda exists in ap-southeast-1" -ForegroundColor Green
    $LAMBDA_ARN = ($lambdaCheck | ConvertFrom-Json).Configuration.FunctionArn
} else {
    Write-Host "Lambda not found in ap-southeast-1. Need to create it." -ForegroundColor Red
    Write-Host "Checking IAM role..." -ForegroundColor Yellow
    
    # Use existing CVUploadLambdaRole
    $ROLE_NAME = "CVUploadLambdaRole"
    $roleCheck = aws iam get-role --role-name $ROLE_NAME 2>$null
    
    if ($roleCheck) {
        $ROLE_ARN = ($roleCheck | ConvertFrom-Json).Role.Arn
        Write-Host "Using existing role: $ROLE_ARN" -ForegroundColor Green
    } else {
        Write-Host "Error: CVUploadLambdaRole not found!" -ForegroundColor Red
        exit 1
    }
    
    # Package Lambda
    Write-Host "Packaging Lambda..." -ForegroundColor Yellow
    if (Test-Path application-lambda.zip) {
        Remove-Item application-lambda.zip
    }
    Compress-Archive -Path amplify/backend/application-lambda.py -DestinationPath application-lambda.zip
    
    # Create Lambda in ap-southeast-1
    Write-Host "Creating Lambda in ap-southeast-1..." -ForegroundColor Yellow
    aws lambda create-function `
        --function-name $LAMBDA_NAME `
        --runtime python3.9 `
        --role $ROLE_ARN `
        --handler application-lambda.lambda_handler `
        --zip-file fileb://application-lambda.zip `
        --timeout 30 `
        --memory-size 256 `
        --region $REGION
    
    $LAMBDA_ARN = (aws lambda get-function --function-name $LAMBDA_NAME --region $REGION | ConvertFrom-Json).Configuration.FunctionArn
    Write-Host "Lambda created: $LAMBDA_ARN" -ForegroundColor Green
    
    Remove-Item application-lambda.zip -ErrorAction SilentlyContinue
}

# Step 2: Create API Gateway
Write-Host "`nStep 2: Creating API Gateway in ap-southeast-1..." -ForegroundColor Yellow
$apis = aws apigatewayv2 get-apis --region $REGION | ConvertFrom-Json
$existingApi = $apis.Items | Where-Object { $_.Name -eq $API_NAME }

if ($existingApi) {
    $API_ID = $existingApi.ApiId
    Write-Host "Using existing API: $API_ID" -ForegroundColor Green
} else {
    $apiResult = aws apigatewayv2 create-api `
        --name $API_NAME `
        --protocol-type HTTP `
        --cors-configuration "AllowOrigins=*,AllowMethods=GET,POST,PUT,DELETE,OPTIONS,AllowHeaders=*" `
        --region $REGION | ConvertFrom-Json
    $API_ID = $apiResult.ApiId
    Write-Host "API created: $API_ID" -ForegroundColor Green
}

# Step 3: Create Integration
Write-Host "`nStep 3: Creating Integration..." -ForegroundColor Yellow
$integrations = aws apigatewayv2 get-integrations --api-id $API_ID --region $REGION | ConvertFrom-Json
$existingIntegration = $integrations.Items | Where-Object { $_.IntegrationUri -eq $LAMBDA_ARN }

if ($existingIntegration) {
    $INTEGRATION_ID = $existingIntegration.IntegrationId
    Write-Host "Using existing integration: $INTEGRATION_ID" -ForegroundColor Green
} else {
    $integrationResult = aws apigatewayv2 create-integration `
        --api-id $API_ID `
        --integration-type AWS_PROXY `
        --integration-uri $LAMBDA_ARN `
        --payload-format-version 2.0 `
        --region $REGION | ConvertFrom-Json
    $INTEGRATION_ID = $integrationResult.IntegrationId
    Write-Host "Integration created: $INTEGRATION_ID" -ForegroundColor Green
    
    # Grant permission
    $accountId = (aws sts get-caller-identity --query Account --output text)
    $sourceArn = "arn:aws:execute-api:${REGION}:${accountId}:${API_ID}/*/*"
    aws lambda add-permission `
        --function-name $LAMBDA_NAME `
        --statement-id apigateway-invoke-app `
        --action lambda:InvokeFunction `
        --principal apigateway.amazonaws.com `
        --source-arn $sourceArn `
        --region $REGION 2>$null
    Write-Host "Lambda permission granted" -ForegroundColor Green
}

# Step 4: Create Routes
Write-Host "`nStep 4: Creating Routes..." -ForegroundColor Yellow

$routes = @(
    "POST /applications",
    "GET /applications/candidate/{candidateId}",
    "GET /applications/job/{jobId}",
    "PUT /applications/{applicationId}/status",
    "OPTIONS /applications"
)

foreach ($routeKey in $routes) {
    Write-Host "  Creating: $routeKey" -ForegroundColor Gray
    
    $existingRoutes = aws apigatewayv2 get-routes --api-id $API_ID --region $REGION | ConvertFrom-Json
    $existingRoute = $existingRoutes.Items | Where-Object { $_.RouteKey -eq $routeKey }
    
    if ($existingRoute) {
        Write-Host "    Already exists" -ForegroundColor Gray
    } else {
        aws apigatewayv2 create-route `
            --api-id $API_ID `
            --route-key $routeKey `
            --target "integrations/$INTEGRATION_ID" `
            --region $REGION | Out-Null
        Write-Host "    Created" -ForegroundColor Green
    }
}

# Step 5: Create Stage
Write-Host "`nStep 5: Creating Stage..." -ForegroundColor Yellow
$stages = aws apigatewayv2 get-stages --api-id $API_ID --region $REGION | ConvertFrom-Json
$defaultStage = $stages.Items | Where-Object { $_.StageName -eq '$default' }

if ($defaultStage) {
    Write-Host "Stage exists" -ForegroundColor Green
} else {
    aws apigatewayv2 create-stage `
        --api-id $API_ID `
        --stage-name '$default' `
        --auto-deploy `
        --region $REGION
    Write-Host "Stage created" -ForegroundColor Green
}

# Final output
$API_ENDPOINT = "https://${API_ID}.execute-api.ap-southeast-1.amazonaws.com"

Write-Host "`n============================================" -ForegroundColor Green
Write-Host "Application API Deployed Successfully!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host "`nAPI Endpoint: $API_ENDPOINT" -ForegroundColor Cyan
Write-Host "`nUpdate this in src/services/applicationService.js:" -ForegroundColor Yellow
Write-Host "const API_ENDPOINT = '$API_ENDPOINT';" -ForegroundColor White
Write-Host "`nTest endpoints:" -ForegroundColor Yellow
Write-Host "  POST   $API_ENDPOINT/applications" -ForegroundColor White
Write-Host "  GET    $API_ENDPOINT/applications/candidate/{candidateId}" -ForegroundColor White
Write-Host "  GET    $API_ENDPOINT/applications/job/{jobId}" -ForegroundColor White
Write-Host "  PUT    $API_ENDPOINT/applications/{applicationId}/status" -ForegroundColor White
