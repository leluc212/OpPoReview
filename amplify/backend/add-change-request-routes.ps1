# PowerShell script to add approve/reject change-request routes to API Gateway HTTP API
# Routes needed:
#   PUT /applications/{applicationId}/approve-change
#   PUT /applications/{applicationId}/reject-change
$ErrorActionPreference = "Continue"

$API_ID      = "l1636ie205"
$INTEGRATION = "jjduf5i"     # ApplicationLambda integration
$AUTHORIZER  = "w7g6id"      # CognitoAuthorizer
$REGION      = "ap-southeast-1"

$ROUTES = @(
    "PUT /applications/{applicationId}/approve-change",
    "PUT /applications/{applicationId}/reject-change"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Adding change-request routes to API Gateway" -ForegroundColor Cyan
Write-Host "API ID: $API_ID" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

foreach ($routeKey in $ROUTES) {
    Write-Host "`nCreating route: $routeKey" -ForegroundColor Yellow

    $result = aws apigatewayv2 create-route `
        --api-id $API_ID `
        --route-key $routeKey `
        --target "integrations/$INTEGRATION" `
        --authorization-type JWT `
        --authorizer-id $AUTHORIZER `
        --region $REGION 2>&1

    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Route created: $routeKey" -ForegroundColor Green
    } else {
        # ConflictException means the route already exists — not a fatal error
        if ($result -match "ConflictException" -or $result -match "already exists") {
            Write-Host "  ⚠️  Route already exists (skipping): $routeKey" -ForegroundColor Yellow
        } else {
            Write-Host "  ❌ Failed to create route: $routeKey" -ForegroundColor Red
            Write-Host "  $result"
        }
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Done! HTTP APIs auto-deploy — routes are active immediately." -ForegroundColor Green
Write-Host "If you also updated application-lambda.py, run update-application-lambda.ps1 too." -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
