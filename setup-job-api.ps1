# Setup Job Post API endpoints on existing API Gateway

$apiId = "dlidp35x33"
$region = "ap-southeast-1"
$accountId = "726911960757"
$lambdaArn = "arn:aws:lambda:${region}:${accountId}:function:JobPostAPI"

Write-Host "Setting up Job Post API on API Gateway: $apiId" -ForegroundColor Cyan

# Get root resource
$rootId = aws apigateway get-resources --rest-api-id $apiId --region $region --query "items[?path=='/'].id" --output text

Write-Host "Root resource ID: $rootId" -ForegroundColor Yellow

# Create /jobs resource
Write-Host ""
Write-Host "Creating /jobs resource..." -ForegroundColor Cyan
$jobsResource = aws apigateway create-resource `
    --rest-api-id $apiId `
    --parent-id $rootId `
    --path-part "jobs" `
    --region $region

$jobsResourceId = ($jobsResource | ConvertFrom-Json).id
Write-Host "✅ /jobs resource created: $jobsResourceId" -ForegroundColor Green

# Create /jobs/{idJob} resource
Write-Host ""
Write-Host "Creating /jobs/{idJob} resource..." -ForegroundColor Cyan
$jobIdResource = aws apigateway create-resource `
    --rest-api-id $apiId `
    --parent-id $jobsResourceId `
    --path-part "{idJob}" `
    --region $region

$jobIdResourceId = ($jobIdResource | ConvertFrom-Json).id
Write-Host "✅ /jobs/{idJob} resource created: $jobIdResourceId" -ForegroundColor Green

# Create /jobs/employer/{employerId} resource
Write-Host ""
Write-Host "Creating /jobs/employer resource..." -ForegroundColor Cyan
$employerResource = aws apigateway create-resource `
    --rest-api-id $apiId `
    --parent-id $jobsResourceId `
    --path-part "employer" `
    --region $region

$employerResourceId = ($employerResource | ConvertFrom-Json).id

$employerIdResource = aws apigateway create-resource `
    --rest-api-id $apiId `
    --parent-id $employerResourceId `
    --path-part "{employerId}" `
    --region $region

$employerIdResourceId = ($employerIdResource | ConvertFrom-Json).id
Write-Host "✅ /jobs/employer/{employerId} resource created: $employerIdResourceId" -ForegroundColor Green

# Create /jobs/active resource
Write-Host ""
Write-Host "Creating /jobs/active resource..." -ForegroundColor Cyan
$activeResource = aws apigateway create-resource `
    --rest-api-id $apiId `
    --parent-id $jobsResourceId `
    --path-part "active" `
    --region $region

$activeResourceId = ($activeResource | ConvertFrom-Json).id
Write-Host "✅ /jobs/active resource created: $activeResourceId" -ForegroundColor Green

# Create /jobs/{idJob}/views resource
Write-Host ""
Write-Host "Creating /jobs/{idJob}/views resource..." -ForegroundColor Cyan
$viewsResource = aws apigateway create-resource `
    --rest-api-id $apiId `
    --parent-id $jobIdResourceId `
    --path-part "views" `
    --region $region

$viewsResourceId = ($viewsResource | ConvertFrom-Json).id
Write-Host "✅ /jobs/{idJob}/views resource created: $viewsResourceId" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Resources created successfully!" -ForegroundColor Green
Write-Host "Now run: ./setup-job-api-methods.ps1" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan

# Save resource IDs for next script
@"
`$apiId = "$apiId"
`$jobsResourceId = "$jobsResourceId"
`$jobIdResourceId = "$jobIdResourceId"
`$employerIdResourceId = "$employerIdResourceId"
`$activeResourceId = "$activeResourceId"
`$viewsResourceId = "$viewsResourceId"
`$lambdaArn = "$lambdaArn"
`$region = "$region"
`$accountId = "$accountId"
"@ | Out-File -FilePath "job-api-config.ps1" -Encoding utf8
