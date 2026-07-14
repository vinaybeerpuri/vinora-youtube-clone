# ============================================================
# fix-hotspot-access.ps1
# Run this script as Administrator to allow mobile access to
# your React (port 3000) and Express (port 5000) dev servers.
# ============================================================

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   Vinora Hotspot Network Fix Script" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Set the Wi-Fi network profile to Private
Write-Host "[1/3] Setting Wi-Fi network profile to Private..." -ForegroundColor Yellow
try {
    $profiles = Get-NetConnectionProfile -ErrorAction Stop
    foreach ($profile in $profiles) {
        if ($profile.InterfaceAlias -like "*Wi-Fi*" -or $profile.Name -like "*Vardhan*") {
            Set-NetConnectionProfile -InterfaceIndex $profile.InterfaceIndex -NetworkCategory Private -ErrorAction Stop
            Write-Host "      OK - '$($profile.Name)' set to Private." -ForegroundColor Green
        }
    }
} catch {
    Write-Host "      WARN: Could not change network profile. Continuing..." -ForegroundColor DarkYellow
    Write-Host "      $_" -ForegroundColor DarkYellow
}

Write-Host ""

# Step 2: Add inbound firewall rule for React Frontend (Port 3000)
Write-Host "[2/3] Adding inbound firewall rule for React (port 3000)..." -ForegroundColor Yellow
$existingRule3000 = Get-NetFirewallRule -DisplayName "React Frontend Hotspot Access" -ErrorAction SilentlyContinue
if ($existingRule3000) {
    Write-Host "      INFO: Rule already exists. Removing and re-adding..." -ForegroundColor DarkYellow
    Remove-NetFirewallRule -DisplayName "React Frontend Hotspot Access" -ErrorAction SilentlyContinue
}
New-NetFirewallRule `
    -DisplayName "React Frontend Hotspot Access" `
    -Direction Inbound `
    -Action Allow `
    -Protocol TCP `
    -LocalPort 3000 `
    -Profile Any `
    -ErrorAction Stop | Out-Null
Write-Host "      OK - Inbound TCP port 3000 allowed on all profiles." -ForegroundColor Green

Write-Host ""

# Step 3: Add inbound firewall rule for Express Backend (Port 5000)
Write-Host "[3/3] Adding inbound firewall rule for Express (port 5000)..." -ForegroundColor Yellow
$existingRule5000 = Get-NetFirewallRule -DisplayName "Express Backend Hotspot Access" -ErrorAction SilentlyContinue
if ($existingRule5000) {
    Write-Host "      INFO: Rule already exists. Removing and re-adding..." -ForegroundColor DarkYellow
    Remove-NetFirewallRule -DisplayName "Express Backend Hotspot Access" -ErrorAction SilentlyContinue
}
New-NetFirewallRule `
    -DisplayName "Express Backend Hotspot Access" `
    -Direction Inbound `
    -Action Allow `
    -Protocol TCP `
    -LocalPort 5000 `
    -Profile Any `
    -ErrorAction Stop | Out-Null
Write-Host "      OK - Inbound TCP port 5000 allowed on all profiles." -ForegroundColor Green

Write-Host ""

# Verification: Show applied rules
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   Verification - Active Rules:" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Get-NetFirewallRule -DisplayName "React Frontend Hotspot Access", "Express Backend Hotspot Access" |
    Select-Object DisplayName, Enabled, Profile, Direction, Action |
    Format-Table -AutoSize

Write-Host ""
Write-Host "Current Network Profiles:" -ForegroundColor Cyan
Get-NetConnectionProfile | Select-Object Name, InterfaceAlias, NetworkCategory | Format-Table -AutoSize

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "   Done! Your app should now be accessible" -ForegroundColor Green
Write-Host "   from your mobile at:" -ForegroundColor Green
Write-Host "   http://10.42.240.41:3000 (Frontend)" -ForegroundColor Green
Write-Host "   http://10.42.240.41:5000 (Backend)" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""

Read-Host "Press Enter to close this window"
