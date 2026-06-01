<#
.SYNOPSIS
Interactive PowerShell helper to deploy Amplify backend and optionally seed the PackageCatalog DynamoDB table.

This script runs a sequence of safe steps and asks for confirmation before each action.
It does NOT run automatically — you must execute it locally.

Prerequisites (run on your dev machine):
- Git configured and repo checked out at project root
- AWS CLI configured (aws configure) or use --profile when prompted
- Amplify CLI installed (if you will run `amplify push`)
- Python 3 available for the seed script

Usage:
  .\scripts\deploy_and_seed.ps1

#>

param(
    [string]$Region = "ap-southeast-1",
    [string]$AwsProfile = "",
    [switch]$AutoYes
)

function Prompt-YesNo([string]$Message, [bool]$DefaultNo = $true) {
    while ($true) {
        $suffix = if ($DefaultNo) { '[y/N]' } else { '[Y/n]' }
        $ans = Read-Host "$Message $suffix"
        if ([string]::IsNullOrWhiteSpace($ans)) { return -not $DefaultNo }
        $a = $ans.Trim().ToLower()
        if ($a -in @('y','yes')) { return $true }
        if ($a -in @('n','no')) { return $false }
        Write-Host "Please answer 'y' or 'n'."
    }
}

function Check-Command([string]$cmd) {
    return (Get-Command $cmd -ErrorAction SilentlyContinue) -ne $null
}

function Run-ExitOnError($exe, $args) {
    Write-Host "Running: $exe $args" -ForegroundColor Cyan
    try {
        $proc = Start-Process -FilePath $exe -ArgumentList $args -NoNewWindow -Wait -PassThru -ErrorAction Stop
        if ($proc.ExitCode -ne 0) {
            throw "Command returned exit code $($proc.ExitCode)"
        }
        return $true
    } catch {
        Write-Host "ERROR running command: $_" -ForegroundColor Red
        return $false
    }
}

function Run-CommandCapture($exe, $args) {
    try {
        $psi = New-Object System.Diagnostics.ProcessStartInfo
        $psi.FileName = $exe
        $psi.Arguments = $args
        $psi.RedirectStandardOutput = $true
        $psi.RedirectStandardError = $true
        $psi.UseShellExecute = $false
        $proc = [System.Diagnostics.Process]::Start($psi)
        $out = $proc.StandardOutput.ReadToEnd()
        $err = $proc.StandardError.ReadToEnd()
        $proc.WaitForExit()
        return @{ ExitCode = $proc.ExitCode; StdOut = $out; StdErr = $err }
    } catch {
        return @{ ExitCode = 1; StdOut = ""; StdErr = $_.Exception.Message }
    }
}

function Ensure-PackageCatalogTable([string]$RegionValue, [string]$ProfileValue) {
    if (-not (Check-Command 'aws')) {
        Write-Host "AWS CLI not found. Cannot verify/create DynamoDB table." -ForegroundColor Red
        return $false
    }

    $profileArg = ""
    if (-not [string]::IsNullOrWhiteSpace($ProfileValue)) { $profileArg = "--profile $ProfileValue" }

    $check = Run-CommandCapture 'aws' "dynamodb describe-table --table-name PackageCatalog --region $RegionValue $profileArg"
    if ($check.ExitCode -eq 0) {
        Write-Host "Table PackageCatalog exists." -ForegroundColor Green
        return $true
    }

    Write-Host "Table PackageCatalog not found." -ForegroundColor Yellow
    if (-not (Prompt-YesNo "Create DynamoDB table PackageCatalog now?")) {
        Write-Host "Skipped creating PackageCatalog table." -ForegroundColor Yellow
        return $false
    }

    $createCmd = "dynamodb create-table --table-name PackageCatalog --attribute-definitions AttributeName=packageId,AttributeType=S --key-schema AttributeName=packageId,KeyType=HASH --billing-mode PAY_PER_REQUEST --region $RegionValue $profileArg"
    $createRes = Run-CommandCapture 'aws' $createCmd
    if ($createRes.ExitCode -ne 0) {
        Write-Host "Failed to create PackageCatalog table: $($createRes.StdErr)" -ForegroundColor Red
        return $false
    }

    Write-Host "Waiting for PackageCatalog table to become ACTIVE..." -ForegroundColor Cyan
    $waitRes = Run-CommandCapture 'aws' "dynamodb wait table-exists --table-name PackageCatalog --region $RegionValue $profileArg"
    if ($waitRes.ExitCode -ne 0) {
        Write-Host "Table wait failed: $($waitRes.StdErr)" -ForegroundColor Red
        return $false
    }

    Write-Host "PackageCatalog table created successfully." -ForegroundColor Green
    return $true
}

Write-Host "Starting interactive deploy+seed helper" -ForegroundColor Green
Write-Host "Project root: $(Get-Location)" -ForegroundColor DarkCyan

if (-not (Check-Command 'git')) {
    Write-Host "Git not found in PATH. Please install Git before proceeding." -ForegroundColor Red
    exit 1
}

if (-not (Check-Command 'aws')) {
    Write-Host "Warning: AWS CLI not found. Steps that interact with DynamoDB or Amplify will fail without AWS CLI." -ForegroundColor Yellow
}

if (-not (Check-Command 'python') -and -not (Check-Command 'python3')) {
    Write-Host "Warning: Python not found. Seed step requires Python 3." -ForegroundColor Yellow
}

# Step 1: create branch + commit/stash
$timestamp = [DateTime]::Now.ToString('yyyyMMdd-HHmmss')
$defaultBranch = "admin-packages-deploy-$timestamp"
$createBranch = $true
if ($AutoYes) { $createBranch = $true }

if (Prompt-YesNo "Step 1: Create a new git branch to contain deploy changes? (will not push)" ) {
    $branchName = Read-Host "Branch name (default: $defaultBranch)"
    if ([string]::IsNullOrWhiteSpace($branchName)) { $branchName = $defaultBranch }

    $res = Run-CommandCapture 'git' "checkout -b $branchName"
    if ($res.ExitCode -ne 0) {
        Write-Host "Failed to create branch: $($res.StdErr)" -ForegroundColor Red
        Write-Host "You may already be on a branch with that name. Aborting." -ForegroundColor Red
        exit 1
    }
    Write-Host "Created and switched to branch $branchName" -ForegroundColor Green

    # Check for uncommitted changes
    $status = Run-CommandCapture 'git' 'status --porcelain'
    if ($status.StdOut.Trim().Length -gt 0) {
        Write-Host "Detected uncommitted changes:" -ForegroundColor Yellow
        Write-Host $status.StdOut
        $choice = Read-Host "You have uncommitted changes. Choose action: (c)ommit / (s)tash / (a)bort [c/s/a]"
        if ($choice -match '^[cC]') {
            $defaultMsg = "chore: prepare package catalog deploy/seed"
            $commitMsg = Read-Host "Commit message (default: $defaultMsg)"
            if ([string]::IsNullOrWhiteSpace($commitMsg)) { $commitMsg = $defaultMsg }
            $ok = Run-ExitOnError 'git' 'add -A'
            if (-not $ok) { Write-Host 'git add failed' -ForegroundColor Red; exit 1 }
            $ok = Run-ExitOnError 'git' "commit -m `"$commitMsg`""
            if (-not $ok) { Write-Host 'git commit failed' -ForegroundColor Red; exit 1 }
            Write-Host "Changes committed." -ForegroundColor Green
        } elseif ($choice -match '^[sS]') {
            $ok = Run-ExitOnError 'git' "stash push -m `"stash before deploy $timestamp`""
            if ($ok) { Write-Host 'Changes stashed.' -ForegroundColor Green }
            else { Write-Host 'git stash failed' -ForegroundColor Red; exit 1 }
        } else {
            Write-Host "Aborting per user request." -ForegroundColor Yellow
            exit 1
        }
    } else {
        Write-Host "No uncommitted changes detected." -ForegroundColor Green
    }
} else {
    Write-Host "Skipped branch creation." -ForegroundColor Yellow
}

# Step 2: optional backup existing PackageCatalog table
if (Prompt-YesNo "Step 2: Create a backup export of DynamoDB table 'PackageCatalog' (recommended)?" ) {
    if (-not (Check-Command 'aws')) { Write-Host "AWS CLI not found. Install and configure AWS CLI before running this step." -ForegroundColor Red; exit 1 }
    if (-not [string]::IsNullOrWhiteSpace($AwsProfile)) { $profileArg = "--profile $AwsProfile" } else { $profileArg = "" }

    Write-Host "Checking if table PackageCatalog exists..."
    $desc = Run-CommandCapture 'aws' "dynamodb describe-table --table-name PackageCatalog --region $Region $profileArg"
    if ($desc.ExitCode -ne 0) {
        Write-Host "Table PackageCatalog not found or AWS CLI error:\n$($desc.StdErr)" -ForegroundColor Yellow
    } else {
        $backupFile = "package_catalog_backup_$timestamp.json"
        Write-Host "Exporting table to $backupFile"
        $scanRes = Run-CommandCapture 'aws' "dynamodb scan --table-name PackageCatalog --region $Region $profileArg --output json"
        if ($scanRes.ExitCode -eq 0) {
            $scanRes.StdOut | Out-File -FilePath $backupFile -Encoding utf8
            Write-Host "Backup saved to $backupFile" -ForegroundColor Green
        } else {
            Write-Host "Failed to scan table: $($scanRes.StdErr)" -ForegroundColor Red
        }
    }
} else {
    Write-Host "Skipping DynamoDB backup." -ForegroundColor Yellow
}

# Step 3: check Amplify status and optionally push
if (Check-Command 'amplify') {
    Write-Host "Amplify CLI detected." -ForegroundColor Green
    if (Prompt-YesNo "Step 3: Run 'amplify status' to review backend changes? (recommended)" ) {
        Run-ExitOnError 'amplify' 'status'
    }

    if (Prompt-YesNo "Run 'amplify push' to deploy backend (this will create/update Lambda/API/DynamoDB)?" ) {
        Write-Host "Running amplify push (may take several minutes)..." -ForegroundColor Cyan
        $pushOk = Run-ExitOnError 'amplify' 'push --yes'
        if (-not $pushOk) {
            Write-Host "Amplify push failed. Inspect output above. Aborting." -ForegroundColor Red
            exit 1
        }
        Write-Host "amplify push completed." -ForegroundColor Green
    } else {
        Write-Host "Skipped amplify push." -ForegroundColor Yellow
    }
} else {
    Write-Host "Amplify CLI not found. Skipping Amplify steps. Install Amplify CLI if you intend to deploy the Lambda/API from this repo." -ForegroundColor Yellow
}

# Step 4: ask for API URL to set in frontend
$apiUrl = Read-Host "Step 4: Enter the Package Subscriptions API URL (leave empty to skip writing .env.local). Example: https://xxxx.execute-api.ap-southeast-1.amazonaws.com/prod"

# Step 5: optional seed of PackageCatalog using local Python script
if (Prompt-YesNo "Step 5: Run local seed script to upsert default package catalog into DynamoDB?" ) {
    if (-not (Check-Command 'python') -and -not (Check-Command 'python3')) {
        Write-Host "Python not found in PATH. Install Python 3 and retry." -ForegroundColor Red
        exit 1
    }

    $py = if (Check-Command 'python') { 'python' } else { 'python3' }
    $profileArgSeed = ""
    if (-not [string]::IsNullOrWhiteSpace($AwsProfile)) { $profileArgSeed = "--profile $AwsProfile" }

    $tableReady = Ensure-PackageCatalogTable -RegionValue $Region -ProfileValue $AwsProfile
    if (-not $tableReady) {
        Write-Host "PackageCatalog table is not ready. Skipping seed step." -ForegroundColor Yellow
    } else {
        Write-Host "Running: $py scripts/seed_package_catalog.py --table PackageCatalog --region $Region --yes $profileArgSeed"
        $args = "scripts/seed_package_catalog.py --table PackageCatalog --region $Region --yes $profileArgSeed"
        $seedRes = Run-CommandCapture $py $args
        if ($seedRes.ExitCode -eq 0) {
            Write-Host "Seed script completed." -ForegroundColor Green
            Write-Host $seedRes.StdOut
        } else {
            Write-Host "Seed script failed: $($seedRes.StdErr)" -ForegroundColor Red
        }
    }
} else {
    Write-Host "Skipping local seed." -ForegroundColor Yellow
}

# Step 6: optionally write .env.local
if (-not [string]::IsNullOrWhiteSpace($apiUrl)) {
    if (Prompt-YesNo "Step 6: Write API URL to .env.local (will backup existing .env.local)?" ) {
        $envFile = ".env.local"
        if (Test-Path $envFile) {
            $bak = "$envFile.bak.$timestamp"
            Copy-Item $envFile $bak -Force
            Write-Host "Backed up existing $envFile to $bak" -ForegroundColor Green
        }

        # Read existing env (if any) and replace key
        $lines = @()
        if (Test-Path $envFile) { $lines = Get-Content $envFile -ErrorAction SilentlyContinue }
        $found = $false
        for ($i = 0; $i -lt $lines.Count; $i++) {
            if ($lines[$i] -match '^VITE_PACKAGE_SUBSCRIPTIONS_API\s*=') {
                $lines[$i] = "VITE_PACKAGE_SUBSCRIPTIONS_API=$apiUrl"
                $found = $true
            }
        }
        if (-not $found) { $lines += "VITE_PACKAGE_SUBSCRIPTIONS_API=$apiUrl" }
        $lines | Out-File -FilePath $envFile -Encoding utf8
        Write-Host ".env.local written with VITE_PACKAGE_SUBSCRIPTIONS_API." -ForegroundColor Green
    } else {
        Write-Host "Skipping writing .env.local." -ForegroundColor Yellow
    }
} else {
    Write-Host "No API URL provided; skipping .env.local write." -ForegroundColor Yellow
}

# Step 7: Optionally start dev server in a new PowerShell window
if (Prompt-YesNo "Step 7: Start dev server (npm run dev) in a new PowerShell window now? (will open a new window)" ) {
    if (-not (Check-Command 'npm')) { Write-Host "npm not found. Install Node.js/npm first." -ForegroundColor Red; exit 1 }
    $psCmd = "npm run dev"
    Start-Process -FilePath "powershell" -ArgumentList "-NoExit","-Command","$psCmd"
    Write-Host "Dev server started in new PowerShell window." -ForegroundColor Green
} else {
    Write-Host "Dev server not started. You can run 'npm run dev' manually when ready." -ForegroundColor Yellow
}

# Step 8: Optional quick API test
if (Prompt-YesNo "Step 8: Run a quick GET /packages test against the API URL provided (will print output)?" ) {
    if ([string]::IsNullOrWhiteSpace($apiUrl)) { Write-Host "No API URL available. Skipping test." -ForegroundColor Yellow }
    else {
        try {
            Write-Host "Testing GET $apiUrl/packages" -ForegroundColor Cyan
            # Prefer curl if present
            if (Check-Command 'curl') {
                Run-ExitOnError 'curl' "-sS -i $apiUrl/packages"
            } else {
                $resp = Invoke-RestMethod -Uri "$apiUrl/packages" -Method GET -ErrorAction Stop
                $resp | ConvertTo-Json -Depth 5
            }
        } catch {
            Write-Host "API test failed: $_" -ForegroundColor Red
        }
    }
}

Write-Host "Finished interactive deploy/seed helper." -ForegroundColor Green
Write-Host "If you need me to generate a CI workflow to run amplify push automatically, tell me and I will prepare it (requires AWS secrets)." -ForegroundColor Cyan
