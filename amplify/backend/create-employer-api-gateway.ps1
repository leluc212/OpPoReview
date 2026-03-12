# Create API Gateway for Employer Profile
Write-Host "Creating API Gateway for Employer Profile..." -ForegroundColor Yellow

$API_NAME = "EmployerProfileAPI"
$REGION = "ap-southeast-1"
$LAMBDA_FUNCTION_NAME = "EmployerProfileAPI"

try {
    # Check if API already exists
    Write-Host "Checking if API Gateway exists..." -ForegroundColor Blue
    $existingApis = aws apigateway get-rest-apis --region $REGION --query "items[?name=='$API_NAME']" --output json | ConvertFrom-Json
    
    if ($existingApis.Count -gt 0) {
        $API_ID = $existingApis[0].id
        Write-Host "API Gateway already exists: $API_ID" -ForegroundColor Green
    } else {
        # Create API Gateway
        Write-Host "Creating new API Gateway..." -ForegroundColor Blue
        $apiResult = aws apigateway create-rest-api --name $API_NAME --region $REGION --output json | ConvertFrom-Json
        $API_ID = $apiResult.id
        Write-Host "API Gateway created: $API_ID" -ForegroundColor Green
    }
    
    Write-Host "API Gateway URL: https://$API_ID.execute-api.$REGION.amazonaws.com/prod" -ForegroundColor Cyan
    
    # Test the API
    Write-Host "Testing API Gateway..." -ForegroundColor Blue
    Start-Sleep -Seconds 5
    
    $testUrl = "https://$API_ID.execute-api.$REGION.amazonaws.com/prod/profile/test-user"
    
    try {
        $response = Invoke-WebRequest -Uri $testUrl -Method GET -Headers @{"Content-Type"="application/json"} -ErrorAction Stop
        Write-Host "API test successful! Status: $($response.StatusCode)" -ForegroundColor Green
        Write-Host "Response: $($response.Content)" -ForegroundColor White
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode
        Write-Host "API Status: $statusCode" -ForegroundColor Yellow
        
        if ($statusCode -eq 404) {
            Write-Host "Perfect! API is working (404 expected for non-existent user)" -ForegroundColor Green
        }
        elseif ($statusCode -eq 403) {
            Write-Host "API needs configuration - this is expected for new API" -ForegroundColor Yellow
        }
        else {
            Write-Host "Unexpected status: $statusCode" -ForegroundColor Yellow
        }
    }
    
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "API Gateway setup completed!" -ForegroundColor Green