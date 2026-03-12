$REGION = "ap-southeast-1"
$FUNCTION_NAME = "EmployerProfileAPI"
$TABLE_NAME = "EmployerProfiles"
$API_ID = "dlidp35x33"

Write-Host "Checking Employer Profile API Status" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Checking Lambda function..." -ForegroundColor Yellow
try {
    $lambda = aws lambda get-function --function-name $FUNCTION_NAME --region $REGION 2>&1 | ConvertFrom-Json
    Write-Host "   Lambda function exists" -ForegroundColor Green
    Write-Host "   Runtime: $($lambda.Configuration.Runtime)" -ForegroundColor Gray
    Write-Host "   Last Modified: $($lambda.Configuration.LastModified)" -ForegroundColor Gray
} catch {
    Write-Host "   Lambda function not found" -ForegroundColor Red
}
Write-Host ""

Write-Host "2. Checking DynamoDB table..." -ForegroundColor Yellow
try {
    $table = aws dynamodb describe-table --table-name $TABLE_NAME --region $REGION 2>&1 | ConvertFrom-Json
    Write-Host "   DynamoDB table exists" -ForegroundColor Green
    Write-Host "   Status: $($table.Table.TableStatus)" -ForegroundColor Gray
    Write-Host "   Item Count: $($table.Table.ItemCount)" -ForegroundColor Gray
} catch {
    Write-Host "   DynamoDB table not found" -ForegroundColor Red
}
Write-Host ""

Write-Host "3. Checking API Gateway..." -ForegroundColor Yellow
try {
    $api = aws apigateway get-rest-api --rest-api-id $API_ID --region $REGION 2>&1 | ConvertFrom-Json
    Write-Host "   API Gateway exists" -ForegroundColor Green
    Write-Host "   Name: $($api.name)" -ForegroundColor Gray
    Write-Host "   Endpoint: https://$API_ID.execute-api.$REGION.amazonaws.com/prod" -ForegroundColor Gray
} catch {
    Write-Host "   API Gateway not found" -ForegroundColor Red
}
Write-Host ""

Write-Host "Status check complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: .\update-employer-lambda.ps1" -ForegroundColor White
Write-Host "2. Test API in browser: test-employer-api.html" -ForegroundColor White
