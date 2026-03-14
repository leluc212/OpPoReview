# Test Package Subscriptions API
$REGION = "ap-southeast-1"
$API_NAME = "PackageSubscriptionsAPI"

Write-Host "Testing Package Subscriptions API..." -ForegroundColor Cyan
Write-Host ""

# Get API endpoint
$apiId = aws apigatewayv2 get-apis --region $REGION --query "Items[?Name=='$API_NAME'].ApiId" --output text

if (-not $apiId) {
    Write-Host "Error: API not found" -ForegroundColor Red
    exit 1
}

$API_ENDPOINT = "https://${apiId}.execute-api.${REGION}.amazonaws.com"
Write-Host "API Endpoint: $API_ENDPOINT" -ForegroundColor Yellow
Write-Host ""

# Test 1: Create a new subscription
Write-Host "Test 1: Creating new subscription..." -ForegroundColor Cyan
$testData = @{
    employerId = "emp-12345"
    companyName = "Test Company"
    packageName = "Quick Boost"
    duration = "7 ngày"
    status = "pending"
    approvalStatus = "pending"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_ENDPOINT/subscriptions" -Method POST -Body $testData -ContentType "application/json"
    $subscriptionId = $response.subscriptionId
    
    Write-Host "Success: Subscription created" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 10)
    Write-Host ""
}
catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 2: Get all subscriptions
Write-Host "Test 2: Getting all subscriptions..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$API_ENDPOINT/subscriptions" -Method GET
    Write-Host "Success: Found $($response.Count) subscriptions" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 10)
    Write-Host ""
}
catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 3: Get subscriptions by employer
Write-Host "Test 3: Getting subscriptions for employer emp-12345..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$API_ENDPOINT/subscriptions/employer/emp-12345" -Method GET
    Write-Host "Success: Found $($response.Count) subscriptions for this employer" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 10)
    Write-Host ""
}
catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 4: Approve subscription
if ($subscriptionId) {
    Write-Host "Test 4: Approving subscription..." -ForegroundColor Cyan
    $updateData = @{
        status = "active"
        approvalStatus = "approved"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$API_ENDPOINT/subscriptions/$subscriptionId" -Method PUT -Body $updateData -ContentType "application/json"
        Write-Host "Success: Subscription approved" -ForegroundColor Green
        Write-Host ($response | ConvertTo-Json -Depth 10)
        Write-Host ""
    }
    catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
    }
}

# Test 5: Create more test subscriptions
Write-Host "Test 5: Creating additional test subscriptions..." -ForegroundColor Cyan

$testSubscriptions = @(
    @{
        employerId = "emp-67890"
        companyName = "Highlands Coffee"
        packageName = "Top Spotlight"
        duration = "7 ngày"
    },
    @{
        employerId = "emp-11111"
        companyName = "Phúc Long"
        packageName = "Hot Search"
        duration = "24h"
    },
    @{
        employerId = "emp-22222"
        companyName = "Katinat"
        packageName = "Spotlight Banner"
        duration = "7 ngày"
    }
)

foreach ($sub in $testSubscriptions) {
    try {
        $json = $sub | ConvertTo-Json
        $response = Invoke-RestMethod -Uri "$API_ENDPOINT/subscriptions" -Method POST -Body $json -ContentType "application/json"
        Write-Host "  Created subscription for $($sub.companyName)" -ForegroundColor White
    }
    catch {
        Write-Host "  Error creating subscription for $($sub.companyName): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Success: Test subscriptions created" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "All tests completed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "API is ready to use!" -ForegroundColor Cyan
Write-Host "Endpoint: $API_ENDPOINT" -ForegroundColor Yellow
