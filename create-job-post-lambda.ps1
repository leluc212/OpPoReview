# Create Lambda function for job posts

Write-Host "Creating IAM role for Lambda..." -ForegroundColor Cyan

# Create trust policy
@"
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
"@ | Out-File -FilePath "trust-policy-job.json" -Encoding utf8 -NoNewline

# Create IAM role
$roleName = "JobPostLambdaRole"
$roleResult = aws iam create-role --role-name $roleName --assume-role-policy-document file://trust-policy-job.json 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ IAM role created" -ForegroundColor Green
} elseif ($roleResult -like "*EntityAlreadyExists*") {
    Write-Host "⚠️ Role already exists, continuing..." -ForegroundColor Yellow
} else {
    Write-Host "❌ Error creating role: $roleResult" -ForegroundColor Red
    exit 1
}

# Attach basic Lambda execution policy
aws iam attach-role-policy --role-name $roleName --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

# Create DynamoDB policy
@"
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": [
        "arn:aws:dynamodb:ap-southeast-1:*:table/PostStandardJob",
        "arn:aws:dynamodb:ap-southeast-1:*:table/PostStandardJob/index/*"
      ]
    }
  ]
}
"@ | Out-File -FilePath "dynamodb-policy-job.json" -Encoding utf8 -NoNewline

# Attach DynamoDB policy
aws iam put-role-policy --role-name $roleName --policy-name JobPostDynamoDBPolicy --policy-document file://dynamodb-policy-job.json

Write-Host "✅ Policies attached" -ForegroundColor Green
Write-Host "Waiting for IAM role to propagate..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Get account ID
$accountId = aws sts get-caller-identity --query Account --output text

# Create Lambda function
Write-Host ""
Write-Host "Creating Lambda function..." -ForegroundColor Cyan

aws lambda create-function `
    --function-name JobPostAPI `
    --runtime python3.11 `
    --role arn:aws:iam::${accountId}:role/$roleName `
    --handler job-post-lambda.lambda_handler `
    --zip-file fileb://amplify/backend/job-post-lambda.zip `
    --timeout 30 `
    --memory-size 256 `
    --environment "Variables={TABLE_NAME=PostStandardJob}" `
    --region ap-southeast-1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Lambda function created successfully!" -ForegroundColor Green
    
    # Get function ARN
    $functionArn = aws lambda get-function --function-name JobPostAPI --region ap-southeast-1 --query "Configuration.FunctionArn" --output text
    Write-Host ""
    Write-Host "Function ARN: $functionArn" -ForegroundColor Cyan
} else {
    Write-Host "❌ Error creating Lambda function" -ForegroundColor Red
    Write-Host "Function might already exist. Try updating instead:" -ForegroundColor Yellow
    Write-Host "aws lambda update-function-code --function-name JobPostAPI --zip-file fileb://amplify/backend/job-post-lambda.zip --region ap-southeast-1" -ForegroundColor Yellow
}
