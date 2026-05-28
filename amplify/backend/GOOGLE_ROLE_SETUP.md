# Google Login Role Onboarding Setup

This project now includes:

- Frontend page: `src/pages/auth/GoogleRoleSetupPage.jsx`
- Frontend service: `src/services/userRoleService.js`
- Backend lambda: `amplify/backend/user-role-lambda.py`
- Post-confirmation DB upsert: `amplify/backend/postConfirmation/index.js`

## What to configure in AWS

1. Deploy `user-role-lambda.py` as a Lambda function.
2. Expose an API route (API Gateway) to this Lambda:
   - `POST /users/me/role`
   - Authorizer: Cognito JWT (same user pool as login)
   - Enable CORS for `POST, OPTIONS`
3. Set Lambda environment variables:
   - `USERS_TABLE_NAME=Users`
   - `USER_POOL_ID=<your_user_pool_id>` (optional if JWT `iss` claim is present)
4. Grant Lambda IAM permissions:
   - `cognito-idp:AdminAddUserToGroup`
   - `cognito-idp:AdminRemoveUserFromGroup`
   - `dynamodb:UpdateItem` on Users table
5. Add frontend environment variable:
   - `VITE_USER_ROLE_API_URL=https://<your-api-domain-or-stage>`

## Runtime behavior

- If social user signs in without a mapped Cognito group role, app sends them to `/auth/google-role-setup`.
- On selection, app calls `POST /users/me/role` to update:
  - Cognito group (`Candidate` or `Employer`)
  - Users table role in DynamoDB
- If `VITE_USER_ROLE_API_URL` is not configured yet, app stores role locally only (for dev continuity).
