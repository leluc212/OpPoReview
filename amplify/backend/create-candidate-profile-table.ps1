# PowerShell script to create CandidateProfiles DynamoDB table
# Run: .\amplify\backend\create-candidate-profile-table.ps1

$TABLE_NAME = "CandidateProfiles"
$REGION = if ($env:AWS_REGION) { $env:AWS_REGION } else { "ap-southeast-1" }

Write-Host "🚀 DynamoDB Table Creation Script" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "🔍 Checking if table '$TABLE_NAME' exists..." -ForegroundColor Yellow

# Check if table exists
try {
    $tableExists = aws dynamodb describe-table --table-name $TABLE_NAME --region $REGION 2>$null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Table '$TABLE_NAME' already exists!" -ForegroundColor Green
        Write-Host "📍 Region: $REGION" -ForegroundColor Cyan
        Write-Host "🔗 Console URL: https://$REGION.console.aws.amazon.com/dynamodbv2/home?region=$REGION#table?name=$TABLE_NAME" -ForegroundColor Cyan
        exit 0
    }
} catch {
    # Table doesn't exist, continue to create
}

Write-Host "📝 Creating table '$TABLE_NAME'..." -ForegroundColor Yellow

# Create table
$createCommand = @"
aws dynamodb create-table \
  --table-name $TABLE_NAME \
  --attribute-definitions \
    AttributeName=userId,AttributeType=S \
    AttributeName=email,AttributeType=S \
  --key-schema \
    AttributeName=userId,KeyType=HASH \
  --global-secondary-indexes \
    '[{\"IndexName\":\"EmailIndex\",\"KeySchema\":[{\"AttributeName\":\"email\",\"KeyType\":\"HASH\"}],\"Projection\":{\"ProjectionType\":\"ALL\"}}]' \
  --billing-mode PAY_PER_REQUEST \
  --stream-specification StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES \
  --tags \
    Key=Environment,Value=dev \
    Key=Application,Value=OppoReview \
    Key=Purpose,Value=CandidateProfileManagement \
  --region $REGION
"@

try {
    $result = Invoke-Expression $createCommand | ConvertFrom-Json
    
    Write-Host "✅ Table '$TABLE_NAME' created successfully!" -ForegroundColor Green
    Write-Host "📍 Region: $REGION" -ForegroundColor Cyan
    Write-Host "🔗 Console URL: https://$REGION.console.aws.amazon.com/dynamodbv2/home?region=$REGION#table?name=$TABLE_NAME" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📊 Table Details:" -ForegroundColor Cyan
    Write-Host "   - Table ARN: $($result.TableDescription.TableArn)" -ForegroundColor White
    Write-Host "   - Table Status: $($result.TableDescription.TableStatus)" -ForegroundColor White
    Write-Host "   - Billing Mode: PAY_PER_REQUEST" -ForegroundColor White
    Write-Host "   - Stream Enabled: Yes" -ForegroundColor White
    Write-Host ""
    Write-Host "⏳ Table is being created. It may take a few moments to become ACTIVE." -ForegroundColor Yellow
    Write-Host "   You can check the status in the AWS Console or run this script again." -ForegroundColor Yellow
    
} catch {
    Write-Host "❌ Error creating table: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Troubleshooting:" -ForegroundColor Yellow
    Write-Host "   1. Make sure AWS CLI is installed: aws --version" -ForegroundColor White
    Write-Host "   2. Configure AWS credentials: aws configure" -ForegroundColor White
    Write-Host "   3. Check your AWS credentials have DynamoDB permissions" -ForegroundColor White
    Write-Host "   4. Verify the region is correct" -ForegroundColor White
    exit 1
}
