# Deploy EmployerProfileAPI Lambda to AWS
$REGION = "ap-southeast-1"
$FUNCTION_NAME = "EmployerProfileAPI"   # tên function trên AWS Console
$ZIP_FILE = "employer-profile-lambda.zip"

Write-Host "📦 Zipping Lambda (lambda-deployment folder)..."
$deployDir = Join-Path $PSScriptRoot "lambda-deployment"
Compress-Archive -Path "$deployDir\*" -DestinationPath $ZIP_FILE -Force

$exists = aws lambda get-function --function-name $FUNCTION_NAME --region $REGION 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "🔄 Updating existing Lambda: $FUNCTION_NAME"
    aws lambda update-function-code `
        --function-name $FUNCTION_NAME `
        --zip-file "fileb://$ZIP_FILE" `
        --region $REGION
    Write-Host "✅ Lambda updated!"
} else {
    Write-Host "❌ Function '$FUNCTION_NAME' not found."
    Write-Host "   Check name in AWS Console and update FUNCTION_NAME in this script."
    exit 1
}
