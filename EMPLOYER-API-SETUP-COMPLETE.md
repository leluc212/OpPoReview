# Employer Profile API - Setup Complete ✅

## API Information

- **API ID**: dlidp35x33
- **API URL**: https://dlidp35x33.execute-api.ap-southeast-1.amazonaws.com/prod
- **Lambda Function**: EmployerProfileAPI
- **DynamoDB Table**: EmployerProfiles
- **Region**: ap-southeast-1

## Endpoints

### 1. POST /profile
Create new employer profile
- **Auth**: Required (Bearer token)
- **Response**: 201 Created

### 2. GET /profile/{userId}
Get employer profile by userId
- **Auth**: Required (Bearer token)
- **Response**: 200 OK or 404 Not Found

### 3. PUT /profile/{userId}
Update employer profile
- **Auth**: Required (Bearer token)
- **Response**: 200 OK or 201 Created (if not exists)

### 4. DELETE /profile/{userId}
Soft delete employer profile
- **Auth**: Required (Bearer token)
- **Response**: 200 OK

### 5. OPTIONS /profile, OPTIONS /profile/{userId}
CORS preflight
- **Auth**: None
- **Response**: 200 OK with CORS headers

## CORS Configuration

- **Allow-Origin**: *
- **Allow-Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Allow-Headers**: Content-Type, Authorization

## Test Results

✅ CORS preflight - 200 OK
✅ Authentication - 401 when no token
✅ GET profile - 404 when not exists
✅ POST create profile - 201 Created with full data

## Environment Variables

File `.env` đã được cập nhật:
```
VITE_EMPLOYER_API_URL=https://dlidp35x33.execute-api.ap-southeast-1.amazonaws.com/prod
```

## Next Steps

1. Start development server: `npm run dev`
2. Test Employer Profile page in browser
3. Login as employer and create/update profile
4. Verify data is saved to DynamoDB

## Troubleshooting

Nếu gặp lỗi, kiểm tra:
- CloudWatch Logs: `/aws/lambda/EmployerProfileAPI`
- DynamoDB Table: `EmployerProfiles`
- API Gateway Logs (nếu enabled)
