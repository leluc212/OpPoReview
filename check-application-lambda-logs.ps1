# Check Application Lambda CloudWatch Logs
Write-Host "=== Checking Application Lambda Logs ===" -ForegroundColor Cyan

# Get Lambda function name
$lambdaName = "ApplicationLambda"

Write-Host "`n1. Getting Lambda function info..." -ForegroundColor Yellow
aws lambda get-function --function-name $lambdaName --region us-east-1 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Lambda function not found!" -ForegroundColor Red
    exit 1
}

Write-Host "`n2. Getting recent log streams..." -ForegroundColor Yellow
$logGroup = "/aws/lambda/$lambdaName"
$streams = aws logs describe-log-streams `
    --log-group-name $logGroup `
    --order-by LastEventTime `
    --descending `
    --max-items 5 `
    --region us-east-1 `
    --query 'logStreams[*].[logStreamName,lastEventTime]' `
    --output text

if ($LASTEXITCODE -eq 0) {
    Write-Host "Recent log streams:" -ForegroundColor Green
    Write-Host $streams
    
    # Get the most recent stream
    $latestStream = ($streams -split "`n")[0] -split "`t" | Select-Object -First 1
    
    if ($latestStream) {
        Write-Host "`n3. Getting latest logs from: $latestStream" -ForegroundColor Yellow
        aws logs get-log-events `
            --log-group-name $logGroup `
            --log-stream-name $latestStream `
            --limit 50 `
            --region us-east-1 `
            --query 'events[*].message' `
            --output text
    }
} else {
    Write-Host "No logs found or log group doesn't exist" -ForegroundColor Red
}

Write-Host "`n4. Checking Lambda configuration..." -ForegroundColor Yellow
aws lambda get-function-configuration --function-name $lambdaName --region us-east-1 --query '{Handler:Handler,Runtime:Runtime,Timeout:Timeout,MemorySize:MemorySize,Role:Role}' --output json

Write-Host "`n5. Testing Lambda directly with sample payload..." -ForegroundColor Yellow
$testPayload = @{
    httpMethod = "POST"
    path = "/applications"
    body = '{"jobId":"TEST-JOB-123","cvUrl":"https://test.s3.amazonaws.com/cv.pdf","cvFilename":"test.pdf"}'
    requestContext = @{
        authorizer = @{
            claims = @{
                sub = "test-user-123"
                email = "test@example.com"
            }
        }
    }
} | ConvertTo-Json -Depth 10

$testPayload | Out-File -FilePath "test-payload.json" -Encoding UTF8

Write-Host "Test payload saved to test-payload.json" -ForegroundColor Green
Write-Host "Invoking Lambda..." -ForegroundColor Yellow

aws lambda invoke `
    --function-name $lambdaName `
    --payload file://test-payload.json `
    --region us-east-1 `
    lambda-response.json

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nLambda Response:" -ForegroundColor Green
    Get-Content lambda-response.json | ConvertFrom-Json | ConvertTo-Json -Depth 10
} else {
    Write-Host "Lambda invocation failed!" -ForegroundColor Red
}

Write-Host "`n=== Done ===" -ForegroundColor Cyan
