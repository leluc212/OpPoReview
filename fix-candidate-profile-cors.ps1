# Fix CORS for Candidate Profile API
Write-Host "Fixing CORS for Candidate Profile API..." -ForegroundColor Cyan

$apiId = "xyp4wkszi7"
$region = "ap-southeast-1"

# Get profile resource
$profileResource = "dd87ks"
$profileUserIdResource = "4zsmey"

Write-Host "`nUpdating CORS for GET /profile/{userId}..." -ForegroundColor Yellow

# Update method response for GET
aws apigateway put-method-response `
    --rest-api-id $apiId `
    --resource-id $profileUserIdResource `
    --http-method GET `
    --status-code 200 `
    --response-parameters "method.response.header.Access-Control-Allow-Origin=false" `
    --region $region

# Update integration response for GET
aws apigateway put-integration-response `
    --rest-api-id $apiId `
    --resource-id $profileUserIdResource `
    --http-method GET `
    --status-code 200 `
    --response-parameters '{\"method.response.header.Access-Control-Allow-Origin\":\"'"'"'*'"'"'\"}' `
    --region $region

Write-Host "`nDeploying API..." -ForegroundColor Yellow
aws apigateway create-deployment `
    --rest-api-id $apiId `
    --stage-name prod `
    --description "Fix CORS for candidate profile GET" `
    --region $region

Write-Host "`nDone! CORS fixed and API deployed." -ForegroundColor Green
Write-Host "Please test the API at: https://xyp4wkszi7.execute-api.ap-southeast-1.amazonaws.com/prod/profile/{userId}" -ForegroundColor Cyan
