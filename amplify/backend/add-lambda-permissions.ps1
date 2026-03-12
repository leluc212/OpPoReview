$API_ID = "xyp4wkszi7"
$REGION = "ap-southeast-1"
$FUNCTION_NAME = "CandidateProfileAPI"
$ACCOUNT_ID = "726911960757"

Write-Host "Adding Lambda invoke permissions for API Gateway..." -ForegroundColor Cyan
Write-Host ""

# Add permission for API Gateway to invoke Lambda
$statementId = "apigateway-invoke-permission"

# Remove existing permission if exists
try {
    aws lambda remove-permission --function-name $FUNCTION_NAME --statement-id $statementId --region $REGION 2>&1 | Out-Null
    Write-Host "Removed old permission" -ForegroundColor Yellow
} catch {}

# Add new permission
Write-Host "Adding permission..." -ForegroundColor Yellow
aws lambda add-permission `
    --function-name $FUNCTION_NAME `
    --statement-id $statementId `
    --action lambda:InvokeFunction `
    --principal apigateway.amazonaws.com `
    --source-arn "arn:aws:execute-api:${REGION}:${ACCOUNT_ID}:${API_ID}/*" `
    --region $REGION 2>&1 | Out-Null

Write-Host "Permission added!" -ForegroundColor Green
Write-Host ""
Write-Host "Testing Lambda invocation..." -ForegroundColor Cyan

# Test invoke
$testPayload = @{
    httpMethod = "GET"
    path = "/profile/test-123"
    pathParameters = @{
        userId = "test-123"
    }
    requestContext = @{}
} | ConvertTo-Json -Depth 10

$testPayload | Out-File -FilePath "test-payload.json" -Encoding UTF8

aws lambda invoke `
    --function-name $FUNCTION_NAME `
    --payload file://test-payload.json `
    --region $REGION `
    test-response.json 2>&1 | Out-Null

$response = Get-Content test-response.json | ConvertFrom-Json
Write-Host "Lambda Response:" -ForegroundColor White
Write-Host ($response | ConvertTo-Json -Depth 10) -ForegroundColor Cyan

# Cleanup
Remove-Item test-payload.json -ErrorAction SilentlyContinue
Remove-Item test-response.json -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "Done! Try refreshing your browser now." -ForegroundColor Green
