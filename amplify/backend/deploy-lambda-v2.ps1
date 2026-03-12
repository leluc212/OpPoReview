# Deploy Lambda Function V2 (Fixed Authorization)
# This script updates the Lambda function with the new version that properly handles authorization

Write-Host "🚀 Deploying Lambda Function V2 (Fixed Authorization)" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

# Configuration
$functionName = "EmployerProfileAPI"
$region = "ap-southeast-1"
$zipFile = "employer-profile-lambda-v2.zip"
$sourceFile = "api-employer-profile-v2.cjs"

# Check if AWS CLI is installed
Write-Host "📋 Checking AWS CLI..." -ForegroundColor Cyan
$awsVersion = aws --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ AWS CLI not found. Please install it first." -ForegroundColor Red
    exit 1
}
Write-Host "✅ AWS CLI found: $awsVersion" -ForegroundColor Green
Write-Host ""

# Create zip file
Write-Host "📦 Creating deployment package..." -ForegroundColor Cyan
if (Test-Path $zipFile) {
    Remove-Item $zipFile -Force
}

# Copy dependencies
Write-Host "📋 Copying dependencies..." -ForegroundColor Cyan
Copy-Item "employer-profile.cjs" -Destination "employer-profile.cjs" -Force
Copy-Item $sourceFile -Destination "index.cjs" -Force

# Create zip
Write-Host "🗜️ Compressing files..." -ForegroundColor Cyan
$compress = @{
    Path = "index.cjs", "employer-profile.cjs", "node_modules"
    CompressionLevel = "Fastest"
    DestinationPath = $zipFile
}
Compress-Archive @compress -Force

if (Test-Path $zipFile) {
    $size = (Get-Item $zipFile).Length / 1MB
    Write-Host "✅ Deployment package created: $zipFile ($([math]::Round($size, 2)) MB)" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to create deployment package" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Update Lambda function
Write-Host "🔄 Updating Lambda function..." -ForegroundColor Cyan
Write-Host "Function: $functionName" -ForegroundColor Cyan
Write-Host "Region: $region" -ForegroundColor Cyan
Write-Host ""

try {
    $updateResult = aws lambda update-function-code `
        --function-name $functionName `
        --zip-file fileb://$zipFile `
        --region $region 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Lambda function updated successfully" -ForegroundColor Green
        Write-Host ""
        Write-Host "📊 Update Details:" -ForegroundColor Cyan
        $updateResult | ConvertFrom-Json | Select-Object FunctionName, FunctionArn, LastModified, CodeSize | Format-List
    } else {
        Write-Host "❌ Failed to update Lambda function:" -ForegroundColor Red
        Write-Host $updateResult -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error updating Lambda function: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Test the API with the new Lambda function"
Write-Host "2. Check CloudWatch logs for any errors"
Write-Host "3. Verify profile save works correctly"
Write-Host ""
Write-Host "📊 To check Lambda logs:" -ForegroundColor Cyan
Write-Host "aws logs tail /aws/lambda/$functionName --follow --region $region" -ForegroundColor Yellow
Write-Host ""
