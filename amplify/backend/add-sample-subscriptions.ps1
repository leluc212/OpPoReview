# Add sample package subscriptions to DynamoDB
$REGION = "ap-southeast-1"
$API_NAME = "PackageSubscriptionsAPI"

Write-Host "Adding sample package subscriptions..." -ForegroundColor Cyan
Write-Host ""

# Get API endpoint
$apiId = aws apigatewayv2 get-apis --region $REGION --query "Items[?Name=='$API_NAME'].ApiId" --output text

if (-not $apiId) {
    Write-Host "Error: API not found. Please run deploy-package-subscriptions-api.ps1 first" -ForegroundColor Red
    exit 1
}

$API_ENDPOINT = "https://${apiId}.execute-api.${REGION}.amazonaws.com"
Write-Host "API Endpoint: $API_ENDPOINT" -ForegroundColor Yellow
Write-Host ""

# Sample subscriptions data (using JSON strings to avoid encoding issues)
$subscriptions = @(
    '{"employerId":"emp-001","companyName":"Highlands Coffee","packageName":"Quick Boost","duration":"24h"}',
    '{"employerId":"emp-002","companyName":"Phuc Long","packageName":"Top Spotlight","duration":"24h"}',
    '{"employerId":"emp-003","companyName":"Katinat chi nhanh quan 8","packageName":"Spotlight Banner","duration":"24h"}',
    '{"employerId":"emp-004","companyName":"The Coffee House","packageName":"Top Spotlight","duration":"24h"}',
    '{"employerId":"emp-005","companyName":"Starbucks chi nhanh quan 10","packageName":"Top Spotlight","duration":"24h"}',
    '{"employerId":"emp-006","companyName":"Talk Bread chi nhanh Thu Duc","packageName":"Quick Boost","duration":"24h"}',
    '{"employerId":"emp-007","companyName":"Trung Nguyen Legend","packageName":"Hot Search","duration":"24h"}',
    '{"employerId":"emp-008","companyName":"Gong Cha chi nhanh quan 1","packageName":"Spotlight Banner","duration":"24h"}',
    '{"employerId":"emp-009","companyName":"Quan nhau OK 3 con de quan 8","packageName":"Quick Boost","duration":"24h"}',
    '{"employerId":"emp-010","companyName":"Lau Bo Sai Gon Vi Vu","packageName":"Top Spotlight","duration":"24h"}',
    '{"employerId":"emp-011","companyName":"Nha hang Hai San Bien Dong","packageName":"Top Spotlight","duration":"24h"}',
    '{"employerId":"emp-012","companyName":"Quan An Vat 24/7","packageName":"Quick Boost","duration":"24h"}',
    '{"employerId":"emp-013","companyName":"Lau Thai Tomyum","packageName":"Spotlight Banner","duration":"24h"}',
    '{"employerId":"emp-014","companyName":"Bun Bo Hue Me Tron","packageName":"Hot Search","duration":"24h"}',
    '{"employerId":"emp-015","companyName":"Com Tam Suon Nuong","packageName":"Quick Boost","duration":"24h"}',
    '{"employerId":"emp-016","companyName":"Oc Dem 79","packageName":"Hot Search","duration":"24h"}',
    '{"employerId":"emp-017","companyName":"Tiem Tra Thang Tu","packageName":"Quick Boost","duration":"24h"}',
    '{"employerId":"emp-018","companyName":"Bia Set 123","packageName":"Spotlight Banner","duration":"24h"}',
    '{"employerId":"emp-019","companyName":"Bep Nha Me Nau","packageName":"Quick Boost","duration":"24h"}',
    '{"employerId":"emp-020","companyName":"Chill Out Beer Club","packageName":"Top Spotlight","duration":"24h"}'
)

Write-Host "Creating $($subscriptions.Count) sample subscriptions..." -ForegroundColor Yellow
Write-Host ""

$successCount = 0
$failCount = 0

foreach ($jsonData in $subscriptions) {
    try {
        $response = Invoke-RestMethod -Uri "$API_ENDPOINT/subscriptions" -Method POST -Body $jsonData -ContentType "application/json; charset=utf-8"
        $companyName = ($jsonData | ConvertFrom-Json).companyName
        Write-Host "  Created: $companyName" -ForegroundColor Green
        $successCount++
        Start-Sleep -Milliseconds 200
    }
    catch {
        $companyName = ($jsonData | ConvertFrom-Json).companyName
        Write-Host "  Failed: $companyName - $($_.Exception.Message)" -ForegroundColor Red
        $failCount++
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Sample data creation complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Success: $successCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor Red
Write-Host ""
Write-Host "You can now view the subscriptions in your admin panel!" -ForegroundColor Cyan
