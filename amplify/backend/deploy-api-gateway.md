# Hướng dẫn Deploy API Gateway + Lambda cho Candidate Profile

## Tổng quan kiến trúc

```
React App → API Gateway → Lambda → DynamoDB
           (REST API)   (Node.js)  (CandidateProfiles)
```

## Bước 1: Tạo IAM Role cho Lambda

### 1.1. Tạo Trust Policy
Tạo file `lambda-trust-policy.json`:

```json
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
```

### 1.2. Tạo IAM Role

```bash
aws iam create-role \
  --role-name CandidateProfileLambdaRole \
  --assume-role-policy-document file://amplify/backend/lambda-trust-policy.json \
  --region ap-southeast-1
```

### 1.3. Attach Policies

```bash
# Basic Lambda execution
aws iam attach-role-policy \
  --role-name CandidateProfileLambdaRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

# DynamoDB access
aws iam put-role-policy \
  --role-name CandidateProfileLambdaRole \
  --policy-name DynamoDBAccess \
  --policy-document file://amplify/backend/dynamodb-policy.json
```

## Bước 2: Package Lambda Function

### 2.1. Cài đặt dependencies

```bash
cd amplify/backend
npm init -y
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
```

### 2.2. Tạo deployment package

```bash
# Windows PowerShell
Compress-Archive -Path api-candidate-profile.cjs,candidate-profile.cjs,node_modules -DestinationPath candidate-profile-lambda.zip -Force
```

## Bước 3: Deploy Lambda Function

```bash
aws lambda create-function \
  --function-name CandidateProfileAPI \
  --runtime nodejs18.x \
  --role arn:aws:iam::726911960757:role/CandidateProfileLambdaRole \
  --handler api-candidate-profile.handler \
  --zip-file fileb://amplify/backend/candidate-profile-lambda.zip \
  --timeout 30 \
  --memory-size 256 \
  --environment Variables={CANDIDATE_PROFILE_TABLE=CandidateProfiles,AWS_REGION=ap-southeast-1} \
  --region ap-southeast-1
```

## Bước 4: Tạo API Gateway

### 4.1. Tạo REST API

```bash
aws apigateway create-rest-api \
  --name "Candidate Profile API" \
  --description "API for managing candidate profiles" \
  --endpoint-configuration types=REGIONAL \
  --region ap-southeast-1
```

Lưu lại `API_ID` từ output.

### 4.2. Get Root Resource ID

```bash
aws apigateway get-resources \
  --rest-api-id YOUR_API_ID \
  --region ap-southeast-1
```

Lưu lại `ROOT_RESOURCE_ID`.

### 4.3. Tạo /profile resource

```bash
aws apigateway create-resource \
  --rest-api-id YOUR_API_ID \
  --parent-id ROOT_RESOURCE_ID \
  --path-part profile \
  --region ap-southeast-1
```

Lưu lại `PROFILE_RESOURCE_ID`.

### 4.4. Tạo /{userId} resource

```bash
aws apigateway create-resource \
  --rest-api-id YOUR_API_ID \
  --parent-id PROFILE_RESOURCE_ID \
  --path-part {userId} \
  --region ap-southeast-1
```

Lưu lại `USER_ID_RESOURCE_ID`.

### 4.5. Tạo Methods

#### GET /profile/{userId}
```bash
# Create method
aws apigateway put-method \
  --rest-api-id YOUR_API_ID \
  --resource-id USER_ID_RESOURCE_ID \
  --http-method GET \
  --authorization-type NONE \
  --region ap-southeast-1

# Create integration
aws apigateway put-integration \
  --rest-api-id YOUR_API_ID \
  --resource-id USER_ID_RESOURCE_ID \
  --http-method GET \
  --type AWS_PROXY \
  --integration-http-method POST \
  --uri arn:aws:apigateway:ap-southeast-1:lambda:path/2015-03-31/functions/arn:aws:lambda:ap-southeast-1:726911960757:function:CandidateProfileAPI/invocations \
  --region ap-southeast-1
```

#### POST /profile
```bash
# Create method
aws apigateway put-method \
  --rest-api-id YOUR_API_ID \
  --resource-id PROFILE_RESOURCE_ID \
  --http-method POST \
  --authorization-type NONE \
  --region ap-southeast-1

# Create integration
aws apigateway put-integration \
  --rest-api-id YOUR_API_ID \
  --resource-id PROFILE_RESOURCE_ID \
  --http-method POST \
  --type AWS_PROXY \
  --integration-http-method POST \
  --uri arn:aws:apigateway:ap-southeast-1:lambda:path/2015-03-31/functions/arn:aws:lambda:ap-southeast-1:726911960757:function:CandidateProfileAPI/invocations \
  --region ap-southeast-1
```

#### PUT /profile/{userId}
```bash
# Create method
aws apigateway put-method \
  --rest-api-id YOUR_API_ID \
  --resource-id USER_ID_RESOURCE_ID \
  --http-method PUT \
  --authorization-type NONE \
  --region ap-southeast-1

# Create integration
aws apigateway put-integration \
  --rest-api-id YOUR_API_ID \
  --resource-id USER_ID_RESOURCE_ID \
  --http-method PUT \
  --type AWS_PROXY \
  --integration-http-method POST \
  --uri arn:aws:apigateway:ap-southeast-1:lambda:path/2015-03-31/functions/arn:aws:lambda:ap-southeast-1:726911960757:function:CandidateProfileAPI/invocations \
  --region ap-southeast-1
```

#### DELETE /profile/{userId}
```bash
# Create method
aws apigateway put-method \
  --rest-api-id YOUR_API_ID \
  --resource-id USER_ID_RESOURCE_ID \
  --http-method DELETE \
  --authorization-type NONE \
  --region ap-southeast-1

# Create integration
aws apigateway put-integration \
  --rest-api-id YOUR_API_ID \
  --resource-id USER_ID_RESOURCE_ID \
  --http-method DELETE \
  --type AWS_PROXY \
  --integration-http-method POST \
  --uri arn:aws:apigateway:ap-southeast-1:lambda:path/2015-03-31/functions/arn:aws:lambda:ap-southeast-1:726911960757:function:CandidateProfileAPI/invocations \
  --region ap-southeast-1
```

### 4.6. Enable CORS

```bash
# OPTIONS method for CORS
aws apigateway put-method \
  --rest-api-id YOUR_API_ID \
  --resource-id USER_ID_RESOURCE_ID \
  --http-method OPTIONS \
  --authorization-type NONE \
  --region ap-southeast-1

# Mock integration for OPTIONS
aws apigateway put-integration \
  --rest-api-id YOUR_API_ID \
  --resource-id USER_ID_RESOURCE_ID \
  --http-method OPTIONS \
  --type MOCK \
  --request-templates '{"application/json": "{\"statusCode\": 200}"}' \
  --region ap-southeast-1

# Method response
aws apigateway put-method-response \
  --rest-api-id YOUR_API_ID \
  --resource-id USER_ID_RESOURCE_ID \
  --http-method OPTIONS \
  --status-code 200 \
  --response-parameters '{"method.response.header.Access-Control-Allow-Headers":false,"method.response.header.Access-Control-Allow-Methods":false,"method.response.header.Access-Control-Allow-Origin":false}' \
  --region ap-southeast-1

# Integration response
aws apigateway put-integration-response \
  --rest-api-id YOUR_API_ID \
  --resource-id USER_ID_RESOURCE_ID \
  --http-method OPTIONS \
  --status-code 200 \
  --response-parameters '{"method.response.header.Access-Control-Allow-Headers":"'"'"'Content-Type,Authorization'"'"'","method.response.header.Access-Control-Allow-Methods":"'"'"'GET,POST,PUT,DELETE,OPTIONS'"'"'","method.response.header.Access-Control-Allow-Origin":"'"'"'*'"'"'"}' \
  --region ap-southeast-1
```

### 4.7. Grant Lambda Permission

```bash
aws lambda add-permission \
  --function-name CandidateProfileAPI \
  --statement-id apigateway-invoke \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:ap-southeast-1:726911960757:YOUR_API_ID/*" \
  --region ap-southeast-1
```

## Bước 5: Deploy API

```bash
aws apigateway create-deployment \
  --rest-api-id YOUR_API_ID \
  --stage-name prod \
  --stage-description "Production stage" \
  --description "First deployment" \
  --region ap-southeast-1
```

## Bước 6: Get API URL

API URL sẽ có dạng:
```
https://YOUR_API_ID.execute-api.ap-southeast-1.amazonaws.com/prod
```

## Bước 7: Test API

```bash
# Test GET
curl https://YOUR_API_ID.execute-api.ap-southeast-1.amazonaws.com/prod/profile/test-user-123

# Test POST
curl -X POST https://YOUR_API_ID.execute-api.ap-southeast-1.amazonaws.com/prod/profile \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","phone":"+84123456789","location":"TP.HCM"}'
```

## Bước 8: Cập nhật React App

Tạo file `.env`:
```
VITE_API_URL=https://YOUR_API_ID.execute-api.ap-southeast-1.amazonaws.com/prod
```

## Troubleshooting

### Lambda không có quyền DynamoDB
```bash
aws iam put-role-policy \
  --role-name CandidateProfileLambdaRole \
  --policy-name DynamoDBAccess \
  --policy-document file://amplify/backend/dynamodb-policy.json
```

### CORS errors
- Đảm bảo đã enable OPTIONS method
- Check response headers có Access-Control-Allow-Origin

### 502 Bad Gateway
- Check Lambda logs: `aws logs tail /aws/lambda/CandidateProfileAPI --follow`
- Verify Lambda có quyền truy cập DynamoDB

## Scripts tự động

Tôi sẽ tạo script PowerShell để tự động hóa toàn bộ quá trình này.
