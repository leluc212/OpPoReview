# Deploy Employer API with Admin endpoints
# This script updates the Lambda function to support admin operations

Write-Host "🚀 Deploying Employer API with Admin Support" -ForegroundColor Cyan
Write-Host ""

$FUNCTION_NAME = "EmployerProfileFunction"
$REGION = "ap-southeast-1"

# Create deployment package
Write-Host "📦 Creating deployment package..." -ForegroundColor Yellow

# Clean up old package
if (Test-Path "employer-profile-admin.zip") {
    Remove-Item "employer-profile-admin.zip" -Force
}

# Copy files to temp directory
$tempDir = "temp-deploy-admin"
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Copy Lambda handler and service files
Copy-Item "api-employer-profile-admin.cjs" "$tempDir/index.cjs"
Copy-Item "employer-profile.cjs" "$tempDir/"

# Copy package.json
Copy-Item "package.json" "$tempDir/"

# Install dependencies
Write-Host "📥 Installing dependencies..." -ForegroundColor Yellow
Push-Location $tempDir
npm install --production
Pop-Location

# Create zip file
Write-Host "🗜️ Creating zip package..." -ForegroundColor Yellow
Compress-Archive -Path "$tempDir/*" -DestinationPath "employer-profile-admin.zip" -Force

# Clean up temp directory
Remove-Item $tempDir -Recurse -Force

Write-Host "✅ Package created: employer-profile-admin.zip" -ForegroundColor Green
Write-Host ""

# Update Lambda function
Write-Host "☁️ Updating Lambda function..." -ForegroundColor Yellow

$updateResult = aws lambda update-function-code `
    --function-name $FUNCTION_NAME `
    --zip-file fileb://employer-profile-admin.zip `
    --region $REGION `
    --output json

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to update Lambda function" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Lambda function updated successfully!" -ForegroundColor Green
Write-Host ""

Write-Host "🎉 Deployment Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Admin endpoints are now available:" -ForegroundColor Cyan
Write-Host "  GET  /admin/employers - List all employers" -ForegroundColor White
Write-Host "  POST /admin/employers/{userId}/approve - Approve employer" -ForegroundColor White
Write-Host "  POST /admin/employers/{userId}/reject - Reject employer" -ForegroundColor White
Write-Host "  POST /admin/employers/{userId}/verify - Update verification" -ForegroundColor White
Write-Host ""
Write-Host "Note: Admin endpoints require 'Admin' group membership in Cognito" -ForegroundColor Yellow
