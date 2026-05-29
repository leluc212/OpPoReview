# Deploy applicants-report-lambda to AWS Lambda Function URL
$REGION = "ap-southeast-1"
$FUNCTION_NAME = "applicants-report-handler"   # <-- đổi nếu tên function khác trên AWS
$ZIP_FILE = "applicants-report-lambda.zip"

Write-Host "📦 Zipping Lambda..."
Compress-Archive -Path applicants-report-lambda.py -DestinationPath $ZIP_FILE -Force

# Check if function exists
$exists = aws lambda get-function --function-name $FUNCTION_NAME --region $REGION 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "🔄 Updating existing Lambda: $FUNCTION_NAME"
    aws lambda update-function-code `
        --function-name $FUNCTION_NAME `
        --zip-file "fileb://$ZIP_FILE" `
        --region $REGION
    Write-Host "✅ Lambda updated!"
} else {
    Write-Host "❌ Function '$FUNCTION_NAME' not found. Check the function name in AWS Console."
    Write-Host "   Run: aws lambda list-functions --region $REGION --query 'Functions[].FunctionName'"
    exit 1
}
