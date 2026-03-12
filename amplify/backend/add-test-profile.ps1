# PowerShell script to add test Vietnamese profile to DynamoDB
# Run: .\amplify\backend\add-test-profile.ps1

$TABLE_NAME = "CandidateProfiles"
$REGION = "ap-southeast-1"

Write-Host "Adding test Vietnamese profile to DynamoDB" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Read JSON file
$jsonContent = Get-Content -Path "amplify/backend/test-vietnamese-data.json" -Raw | ConvertFrom-Json

Write-Host "Profile data:" -ForegroundColor Yellow
Write-Host "   - Name: $($jsonContent.fullName)" -ForegroundColor White
Write-Host "   - Email: $($jsonContent.email)" -ForegroundColor White
Write-Host "   - Phone: $($jsonContent.phone)" -ForegroundColor White
Write-Host "   - Location: $($jsonContent.location)" -ForegroundColor White
Write-Host ""

# Convert to DynamoDB format
$item = @{
    userId = @{ S = $jsonContent.userId }
    fullName = @{ S = $jsonContent.fullName }
    email = @{ S = $jsonContent.email }
    phone = @{ S = $jsonContent.phone }
    location = @{ S = $jsonContent.location }
    cccd = @{ S = $jsonContent.cccd }
    dateOfBirth = @{ S = $jsonContent.dateOfBirth }
    title = @{ S = $jsonContent.title }
    bio = @{ S = $jsonContent.bio }
    skills = @{ L = @($jsonContent.skills | ForEach-Object { @{ S = $_ } }) }
    profileCompletion = @{ N = $jsonContent.profileCompletion.ToString() }
    isActive = @{ BOOL = $jsonContent.isActive }
    createdAt = @{ S = $jsonContent.createdAt }
    updatedAt = @{ S = $jsonContent.updatedAt }
}

$itemJson = $item | ConvertTo-Json -Depth 10 -Compress

Write-Host "Adding to DynamoDB..." -ForegroundColor Yellow

try {
    aws dynamodb put-item `
        --table-name $TABLE_NAME `
        --item $itemJson `
        --region $REGION
    
    Write-Host "Profile added successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Verify in AWS Console:" -ForegroundColor Cyan
    Write-Host "   https://$REGION.console.aws.amazon.com/dynamodbv2/home?region=$REGION#item-explorer?table=$TABLE_NAME" -ForegroundColor White
    Write-Host ""
    Write-Host "View item:" -ForegroundColor Cyan
    
    # Get and display the item
    $result = aws dynamodb get-item `
        --table-name $TABLE_NAME `
        --key "{`"userId`":{`"S`":`"$($jsonContent.userId)`"}}" `
        --region $REGION | ConvertFrom-Json
    
    Write-Host "   - Full Name: $($result.Item.fullName.S)" -ForegroundColor White
    Write-Host "   - Email: $($result.Item.email.S)" -ForegroundColor White
    Write-Host "   - Title: $($result.Item.title.S)" -ForegroundColor White
    Write-Host "   - Profile Completion: $($result.Item.profileCompletion.N)%" -ForegroundColor White
    
} catch {
    Write-Host "Error adding profile" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
