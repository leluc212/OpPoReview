# Get all Employer Profile data from DynamoDB
# This script retrieves all employer profiles and saves to JSON file

Write-Host "Retrieving Employer Profile Data" -ForegroundColor Cyan
Write-Host ""

$tableName = "EmployerProfiles"
$region = "ap-southeast-1"
$outputFile = "employer-profiles-data.json"

Write-Host "Scanning table: $tableName" -ForegroundColor Yellow
Write-Host "Region: $region" -ForegroundColor Yellow
Write-Host ""

try {
    # Scan the entire table
    Write-Host "Fetching data..." -ForegroundColor Blue
    
    $result = aws dynamodb scan `
        --table-name $tableName `
        --region $region `
        --output json
    
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to scan DynamoDB table"
    }
    
    # Parse the result
    $data = $result | ConvertFrom-Json
    
    # Count items
    $itemCount = $data.Items.Count
    
    Write-Host "Found $itemCount employer profile(s)" -ForegroundColor Green
    Write-Host ""
    
    if ($itemCount -eq 0) {
        Write-Host "No data found in the table" -ForegroundColor Yellow
        exit 0
    }
    
    # Save to file
    Write-Host "Saving data to: $outputFile" -ForegroundColor Blue
    $result | Out-File -FilePath $outputFile -Encoding UTF8
    
    Write-Host "Data saved successfully!" -ForegroundColor Green
    Write-Host ""
    
    # Display summary
    Write-Host "Summary:" -ForegroundColor Cyan
    Write-Host "  Total profiles: $itemCount" -ForegroundColor White
    Write-Host "  Output file: $outputFile" -ForegroundColor White
    Write-Host ""
    
    # Display first few profiles (simplified view)
    Write-Host "Employer Profiles:" -ForegroundColor Cyan
    foreach ($item in $data.Items) {
        $companyName = if ($item.companyName.S) { $item.companyName.S } else { "N/A" }
        $email = if ($item.email.S) { $item.email.S } else { "N/A" }
        $status = if ($item.approvalStatus.S) { $item.approvalStatus.S } else { "N/A" }
        $userId = if ($item.userId.S) { $item.userId.S } else { "N/A" }
        
        Write-Host ""
        Write-Host "  Company: $companyName" -ForegroundColor White
        Write-Host "  Email: $email" -ForegroundColor Gray
        Write-Host "  Status: $status" -ForegroundColor $(if ($status -eq "approved") { "Green" } elseif ($status -eq "pending") { "Yellow" } else { "Red" })
        Write-Host "  User ID: $userId" -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "Done! Check $outputFile for complete data." -ForegroundColor Green
    
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Make sure:" -ForegroundColor Yellow
    Write-Host "  1. AWS CLI is installed and configured" -ForegroundColor White
    Write-Host "  2. You have proper AWS credentials" -ForegroundColor White
    Write-Host "  3. You have permission to access DynamoDB" -ForegroundColor White
    Write-Host "  4. The table name and region are correct" -ForegroundColor White
    exit 1
}
