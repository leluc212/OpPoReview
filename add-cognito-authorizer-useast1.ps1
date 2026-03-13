# Add Cognito Authorizer to Application API (us-east-1)

Write-Host "Adding Cognito Authorizer to Application API..." -ForegroundColor Cyan

$REGION = "us-east-1"
$API_ID = "zbkgla009i"

# Step 1: Get Cognito User Pool ID
Write-Host "`nStep 1: Finding Cognito User Pool..." -ForegroundColor Yellow
$userPools = aws cognito-idp list-user-pools --max-results 10 --region $REGION | ConvertFrom-Json
$userPool = $userPools.UserPools | Where-Object { $_.Name -like "*kfc*" -or $_.Name -like "*opporeview*" } | Select-Object -First 1

if (-not $userPool) {
    Write-Host "No user pool found. Listing all pools:" -ForegroundColor Yellow
    $userPools.UserPools | ForEach-Object { Write-Host "  - $($_.Name) ($($_.Id))" }
    $poolId = Read-Host "Enter User Pool ID"
} else {
    $poolId = $userPool.Id
    Write-Host "Found User Pool: $($userPool.Name) ($poolId)" -ForegroundColor Green
}

# Get User Pool ARN
$poolDetails = aws cognito-idp describe-user-pool --user-pool-id $poolId --region $REGION | ConvertFrom-Json
$poolArn = $poolDetails.UserPool.Arn
Write-Host "User Pool ARN: $poolArn" -ForegroundColor Green

# Step 2: Create JWT Authorizer
Write-Host "`nStep 2: Creating JWT Authorizer..." -ForegroundColor Yellow

# Check if authorizer already exists
$authorizers = aws apigatewayv2 get-authorizers --api-id $API_ID --region $REGION | ConvertFrom-Json
$existingAuth = $authorizers.Items | Where-Object { $_.Name -eq "CognitoAuthorizer" }

if ($existingAuth) {
    $AUTHORIZER_ID = $existingAuth.AuthorizerId
    Write-Host "Using existing authorizer: $AUTHORIZER_ID" -ForegroundColor Green
} else {
    # Get User Pool Client ID
    $clients = aws cognito-idp list-user-pool-clients --user-pool-id $poolId --region $REGION | ConvertFrom-Json
    $clientId = $clients.UserPoolClients[0].ClientId
    Write-Host "User Pool Client ID: $clientId" -ForegroundColor Gray
    
    $authResult = aws apigatewayv2 create-authorizer --api-id $API_ID --authorizer-type JWT --identity-source '$request.header.Authorization' --name CognitoAuthorizer --jwt-configuration "Audience=$clientId,Issuer=https://cognito-idp.$REGION.amazonaws.com/$poolId" --region $REGION | ConvertFrom-Json
    
    $AUTHORIZER_ID = $authResult.AuthorizerId
    Write-Host "Authorizer created: $AUTHORIZER_ID" -ForegroundColor Green
}

# Step 3: Update routes to use authorizer
Write-Host "`nStep 3: Updating routes to use authorizer..." -ForegroundColor Yellow

$routes = aws apigatewayv2 get-routes --api-id $API_ID --region $REGION | ConvertFrom-Json

foreach ($route in $routes.Items) {
    if ($route.RouteKey -like "OPTIONS*") {
        Write-Host "  Skipping: $($route.RouteKey)" -ForegroundColor Gray
        continue
    }
    
    Write-Host "  Updating: $($route.RouteKey)" -ForegroundColor Gray
    
    aws apigatewayv2 update-route --api-id $API_ID --route-id $route.RouteId --authorization-type JWT --authorizer-id $AUTHORIZER_ID --region $REGION | Out-Null
    
    Write-Host "    Updated" -ForegroundColor Green
}

Write-Host "`n============================================" -ForegroundColor Green
Write-Host "Cognito Authorizer Added Successfully!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host "`nAuthorizer ID: $AUTHORIZER_ID" -ForegroundColor Cyan
Write-Host "User Pool: $poolId" -ForegroundColor Cyan
Write-Host "`nAll routes now require JWT authentication" -ForegroundColor Yellow
