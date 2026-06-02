# Deploy EmployerProfileAPI Lambda to AWS
$REGION = "ap-southeast-1"
$FUNCTION_NAME = "EmployerProfileAPI"
$ZIP_FILE = "employer-profile-lambda.zip"

Write-Host "Zipping Lambda (lambda-deployment folder)..."
$deployDir = Join-Path $PSScriptRoot "lambda-deployment"
Compress-Archive -Path "$deployDir\*" -DestinationPath $ZIP_FILE -Force

Write-Host "Updating existing Lambda: $FUNCTION_NAME"
aws lambda update-function-code --function-name $FUNCTION_NAME --zip-file "fileb://$ZIP_FILE" --region $REGION
Write-Host "Lambda updated successfully!"
