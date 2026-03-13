# Create Lambda function for CV upload
$functionName = "CVUploadFunction"
$roleName = "CVUploadLambdaRole"
$region = "ap-southeast-1"
$bucketName = "opporeview-cv-storage"

Write-Host "Creating IAM role..." -ForegroundColor Cyan

# Create trust policy
$trustJson = '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}'
$trustJson | Out-File -FilePath "trust-policy.json" -Encoding ascii

aws iam create-role --role-name $roleName --assume-role-policy-document file://trust-policy.json --description "Role for CV Upload Lambda"
Remove-Item "trust-policy.json"

# Attach basic execution policy
Write-Host "Attaching policies..." -ForegroundColor Cyan
aws iam attach-role-policy --role-name $roleName --policy-arn "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"

# Create inline policy
$policyJson = "{`"Version`":`"2012-10-17`",`"Statement`":[{`"Effect`":`"Allow`",`"Action`":[`"s3:PutObject`",`"s3:GetObject`",`"s3:DeleteObject`"],`"Resource`":`"arn:aws:s3:::$bucketName/*`"},{`"Effect`":`"Allow`",`"Action`":[`"dynamodb:GetItem`",`"dynamodb:PutItem`",`"dynamodb:UpdateItem`"],`"Resource`":`"arn:aws:dynamodb:${region}:*:table/CandidateProfiles`"}]}"
$policyJson | Out-File -FilePath "inline-policy.json" -Encoding ascii

aws iam put-role-policy --role-name $roleName --policy-name "CVUploadPolicy" --policy-document file://inline-policy.json
Remove-Item "inline-policy.json"

Write-Host "Waiting for role..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Package Lambda
Write-Host "Packaging Lambda..." -ForegroundColor Cyan
if (Test-Path "amplify/backend/cv-upload-lambda.zip") {
    Remove-Item "amplify/backend/cv-upload-lambda.zip"
}
Compress-Archive -Path "amplify/backend/cv-upload-lambda.py" -DestinationPath "amplify/backend/cv-upload-lambda.zip"

# Create Lambda
Write-Host "Creating Lambda function..." -ForegroundColor Cyan
$accountId = aws sts get-caller-identity --query Account --output text
$roleArn = "arn:aws:iam::${accountId}:role/$roleName"

aws lambda create-function --function-name $functionName --runtime python3.11 --role $roleArn --handler cv-upload-lambda.lambda_handler --zip-file fileb://amplify/backend/cv-upload-lambda.zip --timeout 30 --memory-size 512 --region $region

if ($LASTEXITCODE -ne 0) {
    Write-Host "Updating existing function..." -ForegroundColor Yellow
    aws lambda update-function-code --function-name $functionName --zip-file fileb://amplify/backend/cv-upload-lambda.zip --region $region
}

# Add API Gateway permission
Write-Host "Adding API Gateway permission..." -ForegroundColor Cyan
$apiId = "v56v542h8f"
aws lambda add-permission --function-name $functionName --statement-id "apigateway-invoke" --action lambda:InvokeFunction --principal apigateway.amazonaws.com --source-arn "arn:aws:execute-api:${region}:${accountId}:${apiId}/*/*" --region $region

Write-Host ""
Write-Host "Lambda function created successfully!" -ForegroundColor Green
Write-Host "Function name: $functionName" -ForegroundColor Yellow
