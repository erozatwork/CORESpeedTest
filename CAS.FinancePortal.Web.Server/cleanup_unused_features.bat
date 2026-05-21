@echo off
echo Cleaning up unused features (SeatAssignment, AssetMonitoring)...
cd /d "%~dp0"

REM === Controllers ===
del /f /q "Controllers\SeatAssignmentController.cs" && echo DELETED: SeatAssignmentController.cs || echo NOT FOUND: SeatAssignmentController.cs
del /f /q "Controllers\AssetMonitoringController.cs" && echo DELETED: AssetMonitoringController.cs || echo NOT FOUND: AssetMonitoringController.cs
del /f /q "Controllers\RequestFormController.cs" && echo DELETED: RequestFormController.cs || echo NOT FOUND: RequestFormController.cs

REM === Core Application Interfaces ===
del /f /q "Core\Applications\IAssetMonitoringService.cs" && echo DELETED: IAssetMonitoringService.cs || echo NOT FOUND: IAssetMonitoringService.cs
del /f /q "Core\Applications\ISeatAssignmentService.cs" && echo DELETED: ISeatAssignmentService.cs || echo NOT FOUND: ISeatAssignmentService.cs
del /f /q "Core\Applications\ISeatAssignmentLocationService.cs" && echo DELETED: ISeatAssignmentLocationService.cs || echo NOT FOUND: ISeatAssignmentLocationService.cs

REM === Persistence Application Services ===
del /f /q "Persistence\Applications\AssetMonitoringService.cs" && echo DELETED: AssetMonitoringService.cs || echo NOT FOUND: AssetMonitoringService.cs
del /f /q "Persistence\Applications\SeatAssignmentService.cs" && echo DELETED: SeatAssignmentService.cs || echo NOT FOUND: SeatAssignmentService.cs
del /f /q "Persistence\Applications\SeatAssignmentLocationService.cs" && echo DELETED: SeatAssignmentLocationService.cs || echo NOT FOUND: SeatAssignmentLocationService.cs

REM === Core Repository Interfaces ===
del /f /q "Core\Repositories\IAssetMonitoringRepository.cs" && echo DELETED: IAssetMonitoringRepository.cs || echo NOT FOUND: IAssetMonitoringRepository.cs
del /f /q "Core\Repositories\ISeatAssignmentRepository.cs" && echo DELETED: ISeatAssignmentRepository.cs || echo NOT FOUND: ISeatAssignmentRepository.cs
del /f /q "Core\Repositories\IStationRepository.cs" && echo DELETED: IStationRepository.cs || echo NOT FOUND: IStationRepository.cs

REM === Persistence Repositories ===
del /f /q "Persistence\Repositories\AssetMonitoringRepository.cs" && echo DELETED: AssetMonitoringRepository.cs || echo NOT FOUND: AssetMonitoringRepository.cs
del /f /q "Persistence\Repositories\SeatAssignmentRepository.cs" && echo DELETED: SeatAssignmentRepository.cs || echo NOT FOUND: SeatAssignmentRepository.cs
del /f /q "Persistence\Repositories\StationRepository.cs" && echo DELETED: StationRepository.cs || echo NOT FOUND: StationRepository.cs

REM === DTO Folders ===
rmdir /s /q "Core\Models\Dtos\AssetMonitoring" && echo DELETED DIR: AssetMonitoring DTOs || echo NOT FOUND DIR: AssetMonitoring DTOs
rmdir /s /q "Core\Models\Dtos\SeatAssignment" && echo DELETED DIR: SeatAssignment DTOs || echo NOT FOUND DIR: SeatAssignment DTOs

REM === Server Root Junk Files ===
if exist "CHANGELOG.md" (del /f /q "CHANGELOG.md" && echo DELETED: CHANGELOG.md) else (echo NOT FOUND: CHANGELOG.md)
del /f /q "seed_AssetHistoryStatus.sql" && echo DELETED: seed_AssetHistoryStatus.sql || echo NOT FOUND: seed_AssetHistoryStatus.sql
del /f /q "Core.Agile.OpsPortal.Web.Server.sln" && echo DELETED: Core.Agile.OpsPortal.Web.Server.sln || echo NOT FOUND: Core.Agile.OpsPortal.Web.Server.sln
del /f /q "Core.Agile.Template.Web.Server.http" && echo DELETED: Core.Agile.Template.Web.Server.http || echo NOT FOUND: Core.Agile.Template.Web.Server.http

REM === _fileRootFolder (AssetMonitoring docs) ===
rmdir /s /q "_fileRootFolder" && echo DELETED DIR: _fileRootFolder || echo NOT FOUND DIR: _fileRootFolder

echo.
echo Done! All unused feature files have been removed.
pause
