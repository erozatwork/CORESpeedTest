@echo off
echo ============================================================
echo  CAS Finance Portal - Cleanup and Rename Script
echo  Run this from the project root directory
echo ============================================================
echo.

cd /d "%~dp0"

REM ============================================================
REM  STEP 1: Delete root-level junk/legacy files
REM ============================================================
echo [1/5] Removing root-level legacy files...
if exist "CAS.AdminPortal.Web.sln"        (del /f /q "CAS.AdminPortal.Web.sln"        && echo   DELETED: CAS.AdminPortal.Web.sln)        else echo   SKIP: CAS.AdminPortal.Web.sln not found
if exist "Core.Agile.AdminPortal.Web.sln" (del /f /q "Core.Agile.AdminPortal.Web.sln" && echo   DELETED: Core.Agile.AdminPortal.Web.sln) else echo   SKIP: Core.Agile.AdminPortal.Web.sln not found
if exist "SHARED_COMPONENTS_RULE.md"      (del /f /q "SHARED_COMPONENTS_RULE.md"      && echo   DELETED: SHARED_COMPONENTS_RULE.md)      else echo   SKIP: SHARED_COMPONENTS_RULE.md not found
if exist "bin"  (rmdir /s /q "bin"  && echo   DELETED DIR: bin)  else echo   SKIP: bin not found
if exist "obj"  (rmdir /s /q "obj"  && echo   DELETED DIR: obj)  else echo   SKIP: obj not found

REM ============================================================
REM  STEP 2: Run server-side cleanup (delete unused feature files)
REM ============================================================
echo.
echo [2/6] Running server-side feature cleanup...
if exist "CAS.FinancePortal.Web.Server\cleanup_unused_features.bat" (
    call "CAS.FinancePortal.Web.Server\cleanup_unused_features.bat"
    del /f /q "CAS.FinancePortal.Web.Server\cleanup_unused_features.bat" && echo   DELETED: cleanup_unused_features.bat
) else (
    echo   SKIP: cleanup_unused_features.bat not found - may already have been run
)

REM Delete old .csproj (replaced by CAS.FinancePortal.Web.Server.csproj)
if exist "CAS.FinancePortal.Web.Server\Core.Agile.OpsPortal.Web.Server.csproj" (
    del /f /q "CAS.FinancePortal.Web.Server\Core.Agile.OpsPortal.Web.Server.csproj" && echo   DELETED: Core.Agile.OpsPortal.Web.Server.csproj
)
REM Delete old .csproj.user files
for %%F in ("Core.Agile.OpsPortal.Web.Server.csproj.user" "Core.Agile.AdminPortal.Web.Server.csproj.user") do (
    if exist "CAS.FinancePortal.Web.Server\%%~F" del /f /q "CAS.FinancePortal.Web.Server\%%~F" && echo   DELETED: %%~F
)
REM Delete server bin/obj build artifacts
if exist "CAS.FinancePortal.Web.Server\bin" (rmdir /s /q "CAS.FinancePortal.Web.Server\bin" && echo   DELETED DIR: CAS.FinancePortal.Web.Server\bin)
if exist "CAS.FinancePortal.Web.Server\obj" (rmdir /s /q "CAS.FinancePortal.Web.Server\obj" && echo   DELETED DIR: CAS.FinancePortal.Web.Server\obj)

REM Delete unused entity files (AssetMonitoring-specific, SeatAssignment-specific)
set TABLES=CAS.FinancePortal.Web.Server\Core\Models\Entities\CurrentApplication\Tables
for %%F in (AssetDeployment.cs AssetEmployeeHistory.cs AssetHistory.cs AssetHistoryStatus.cs AssetService.cs AssetServicesType.cs Cluster.cs SeatAssignment.cs Station.cs Office.cs) do (
    if exist "%TABLES%\%%F" (del /f /q "%TABLES%\%%F" && echo   DELETED entity: %%F) else echo   SKIP: %%F not found
)

REM Delete unused entity config files
set TBLCFG=CAS.FinancePortal.Web.Server\Persistence\EntityConfigurations\CurrentApplication\Tables
for %%F in (AssetDeploymentConfig.cs AssetEmployeeHistoryConfig.cs AssetHistoryConfig.cs AssetHistoryStatus.cs AssetServiceConfig.cs AssetServicesTypeConfig.cs ClusterConfig.cs SeatAssignmentConfig.cs StationConfig.cs OfficeConfig.cs) do (
    if exist "%TBLCFG%\%%F" (del /f /q "%TBLCFG%\%%F" && echo   DELETED config: %%F) else echo   SKIP: %%F not found
)

REM Delete commented-out Views config
set VWCFG=CAS.FinancePortal.Web.Server\Persistence\EntityConfigurations\CurrentApplication\Views
if exist "%VWCFG%\VwDepartmentTeamConfig.cs" (del /f /q "%VWCFG%\VwDepartmentTeamConfig.cs" && echo   DELETED: VwDepartmentTeamConfig.cs)

REM Delete server email_template folder (excluded from compile, not needed)
if exist "CAS.FinancePortal.Web.Server\email_template" (rmdir /s /q "CAS.FinancePortal.Web.Server\email_template" && echo   DELETED DIR: email_template)

REM ============================================================
REM  STEP 3: Replace old namespace in all .cs files
REM ============================================================
echo.
echo [3/6] Replacing namespace in all .cs files...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command ^
  "$dir = 'CAS.FinancePortal.Web.Server';" ^
  "$files = Get-ChildItem -Path $dir -Recurse -Filter '*.cs';" ^
  "$count = 0;" ^
  "foreach ($f in $files) {" ^
  "  $c = [System.IO.File]::ReadAllText($f.FullName);" ^
  "  $n = $c -replace 'Core\.Agile\.OpsPortal\.Web\.Server', 'CAS.FinancePortal.Web.Server';" ^
  "  if ($c -ne $n) { [System.IO.File]::WriteAllText($f.FullName, $n); $count++ }" ^
  "};" ^
  "Write-Host ('  Updated namespace in ' + $count + ' .cs files')"

REM ============================================================
REM  STEP 4: Delete unused client feature folders
REM ============================================================
echo.
echo [4/6] Removing unused frontend feature folders...

set CLIENT_FEATURES=cas.adminportal.web.client\src\features
if not exist "%CLIENT_FEATURES%" set CLIENT_FEATURES=cas.financeportal.web.client\src\features

for %%F in (coaching scorecard sfr3 seat_assignment AssetMonitoring document_policy Request_Form) do (
    if exist "%CLIENT_FEATURES%\%%F" (
        rmdir /s /q "%CLIENT_FEATURES%\%%F" && echo   DELETED DIR: features\%%F
    ) else (
        echo   SKIP: features\%%F not found
    )
)

REM Also remove client junk files
for %%F in (build.txt debug_build.txt ls.txt) do (
    if exist "cas.adminportal.web.client\%%F"    del /f /q "cas.adminportal.web.client\%%F"    && echo   DELETED: cas.adminportal.web.client\%%F
    if exist "cas.financeportal.web.client\%%F"  del /f /q "cas.financeportal.web.client\%%F"  && echo   DELETED: cas.financeportal.web.client\%%F
)

REM ============================================================
REM  STEP 4: Rename folders using git mv (preserves history)
REM ============================================================
echo.
echo [5/6] Renaming folders (git mv)...

REM Rename client folder
if exist "cas.adminportal.web.client" (
    git mv cas.adminportal.web.client cas.financeportal.web.client && echo   RENAMED: cas.adminportal.web.client -^> cas.financeportal.web.client
) else (
    echo   SKIP: cas.adminportal.web.client already renamed or not found
)

REM Rename server folder
if exist "Core.Agile.OpsPortal.Web.Server" (
    git mv Core.Agile.OpsPortal.Web.Server CAS.FinancePortal.Web.Server && echo   RENAMED: Core.Agile.OpsPortal.Web.Server -^> CAS.FinancePortal.Web.Server
) else (
    echo   SKIP: Core.Agile.OpsPortal.Web.Server already renamed or not found
)

REM Rename the .csproj file inside the new server folder
if exist "CAS.FinancePortal.Web.Server\Core.Agile.OpsPortal.Web.Server.csproj" (
    git mv "CAS.FinancePortal.Web.Server\Core.Agile.OpsPortal.Web.Server.csproj" "CAS.FinancePortal.Web.Server\CAS.FinancePortal.Web.Server.csproj" && echo   RENAMED: .csproj to CAS.FinancePortal.Web.Server.csproj
    REM Update .sln to reference the renamed .csproj
    powershell -Command "(Get-Content 'CAS.FinancePortal.Web.sln') -replace 'Core\.Agile\.OpsPortal\.Web\.Server\.csproj', 'CAS.FinancePortal.Web.Server.csproj' | Set-Content 'CAS.FinancePortal.Web.sln'" && echo   UPDATED: .sln reference to renamed .csproj
)

REM Remove old .csproj.user files
if exist "CAS.FinancePortal.Web.Server\Core.Agile.OpsPortal.Web.Server.csproj.user"  del /f /q "CAS.FinancePortal.Web.Server\Core.Agile.OpsPortal.Web.Server.csproj.user"
if exist "CAS.FinancePortal.Web.Server\Core.Agile.AdminPortal.Web.Server.csproj.user" del /f /q "CAS.FinancePortal.Web.Server\Core.Agile.AdminPortal.Web.Server.csproj.user"

REM ============================================================
REM  STEP 5: Update .csproj SpaRoot reference after rename
REM ============================================================
echo.
echo [6/6] Updating .csproj SpaRoot path...
set CSPROJ=CAS.FinancePortal.Web.Server\CAS.FinancePortal.Web.Server.csproj
if exist "%CSPROJ%" (
    powershell -Command "(Get-Content '%CSPROJ%') -replace 'cas\.adminportal\.web\.client', 'cas.financeportal.web.client' | Set-Content '%CSPROJ%'" && echo   UPDATED: SpaRoot path in .csproj
) else (
    echo   SKIP: .csproj not found at expected path
)

REM Stage everything
git add -A

echo.
echo ============================================================
echo  Done! Review changes with: git status
echo  Then commit with:
echo    git commit -m "chore: rename project to CAS.FinancePortal.Web, remove non-finance features"
echo ============================================================
pause
