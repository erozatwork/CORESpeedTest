import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@shared/components/ui/card";
import { useAuthContext } from "@features/auth/useAuthContext";
import MetricsGrid from "../components/MetricsGrid";
import { useSpeedTestAPI } from "../hooks/useSpeedTestAPI";
import LocationCard from "../components/LocationCard";
import CameraFeedCard from "../components/CameraFeedCard";
import { useChecklist } from "../hooks/useChecklist";
import { useChecklistContext } from "../context/ChecklistContext";
import { useGeolocation } from "../hooks/useGeolocation";
import { getLocationDetails } from "../utils/geolocation";
import { monitoringApi } from "@features/monitoring/api/monitoringApi";
import { getCompleteDeviceStatus } from "../utils/deviceStatus";
import { getPublicIP } from "../utils/ipDetection";
import { toast } from "sonner";
import { Alert } from "@shared/components/alert";

export default function ChecklistPage() {
  const { user, isInitialized, isAuthenticated } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const { checklistData, fetchToday, create } = useChecklist();
  const { setChecklistState: setContextChecklistState } = useChecklistContext();
  const { getLocation: fetchGeolocation } = useGeolocation();
  const [mapCenter, setMapCenter] = useState({
    latitude: null,
    longitude: null,
  });
  const [mapRecenterVersion, setMapRecenterVersion] = useState(0);
  
  const [checklistState, setChecklistState] = useState({
    downloadSpeed: 0,
    uploadSpeed: 0,
    latitude: null,
    longitude: null,
    address: null,
    publicIp: "0.0.0.0",
    deviceStatus: "online",
    signal: "strong",
    cameraStatus: "offline",
    lastSync: null,
    battery: 74,
  });

  const [saveStatus, setSaveStatus] = useState(null);

  const { getLatest, saveSpeedTestResult } = useSpeedTestAPI();

  useEffect(() => {
    loadChecklistData();
    loadMetricsData();
  }, []);

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      loadMetricsData();
    }
  }, [isInitialized, isAuthenticated]);

  const loadLatestSpeed = async () => {
    try {
      const latest = await getLatest();
      if (latest) {
        setChecklistState((prev) => ({
          ...prev,
          downloadSpeed: latest.downloadMbps ?? prev.downloadSpeed,
          uploadSpeed: latest.uploadMbps ?? prev.uploadSpeed,
          publicIp: latest.publicIp ?? prev.publicIp,
        }));
      }
    } catch (err) {
      console.debug("No latest speed available:", err?.message || err);
    }
  };

  const loadMetricsData = async () => {
    try {
      const todayChecklist = await fetchToday();

      if (todayChecklist) {
        setChecklistState((prev) => ({
          ...prev,
          downloadSpeed: todayChecklist.DownloadSpeed ?? todayChecklist.downloadSpeed ?? prev.downloadSpeed,
          uploadSpeed: todayChecklist.UploadSpeed ?? todayChecklist.uploadSpeed ?? prev.uploadSpeed,
          publicIp: todayChecklist.PublicIp ?? todayChecklist.publicIp ?? prev.publicIp,
        }));
        return;
      }

      await loadLatestSpeed();
    } catch (err) {
      console.debug("No checklist metrics available:", err?.message || err);
      await loadLatestSpeed();
    }
  };

  // Sync local state with context for sidebar access
  useEffect(() => {
    setContextChecklistState(checklistState);
  }, [checklistState, setContextChecklistState]);

  const loadChecklistData = async () => {
    setIsLoading(true);
    try {
      // Collect only the device and location data for now.
      const [geoData, deviceData, detectedIp] = await Promise.all([
        fetchGeolocation(),
        getCompleteDeviceStatus(),
        getPublicIP(),
      ]);

      // Get location details from geolocation coordinates
      let locationDetails = {};
      if (geoData && geoData.latitude && geoData.longitude) {
        locationDetails = await getLocationDetails(geoData.latitude, geoData.longitude);
      }

      // Update state with all collected data
      setChecklistState((prev) => ({
        ...prev,
        latitude: locationDetails.latitude || geoData?.latitude || null,
        longitude: locationDetails.longitude || geoData?.longitude || null,
        address: locationDetails.address || null,
        publicIp: detectedIp && detectedIp !== "Unknown" ? detectedIp : prev.publicIp,
        deviceStatus: deviceData.deviceStatus,
        signal: deviceData.signal,
        battery: deviceData.battery,
        lastSync: new Date(),
      }));

      setMapCenter({
        latitude: locationDetails.latitude || geoData?.latitude || null,
        longitude: locationDetails.longitude || geoData?.longitude || null,
      });
      setMapRecenterVersion((prev) => prev + 1);
    } catch (error) {
      console.error("Error loading checklist data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    const employeeId = Number(user?.userId) || (import.meta.env.DEV ? 9 : null);

    if (!employeeId) {
      console.error("User ID not found in context");
      toast.error("Unable to save — user session not found. Please log in again.");
      return;
    }

    setIsLoading(true);
    setSaveStatus(null);
    try {
      // Prepare data with employee ID
      const checklistPayload = {
        EmployeeId: employeeId,
        DownloadSpeed: checklistState.downloadSpeed,
        UploadSpeed: checklistState.uploadSpeed,
        Latitude: checklistState.latitude,
        Longitude: checklistState.longitude,
        Address: checklistState.address,
        PublicIp: checklistState.publicIp,
        DeviceStatus: checklistState.deviceStatus,
        Signal: checklistState.signal,
        CameraStatus: checklistState.cameraStatus,
        Battery: checklistState.battery,
        IsWFH: true,
      };

      await create(checklistPayload);
      // Also create a monitoring record for historical reporting
      try {
        const monitoringPayload = {
          EmployeeId: employeeId,
          EmployeeName: user?.fullName || `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
          Department: user?.departmentName || user?.department || "",
          Location: checklistState.address || (checklistState.latitude && checklistState.longitude ? `${checklistState.latitude},${checklistState.longitude}` : ""),
          DownloadSpeed: checklistState.downloadSpeed,
          UploadSpeed: checklistState.uploadSpeed,
          IpAddress: checklistState.publicIp,
          Latitude: checklistState.latitude,
          Longitude: checklistState.longitude,
        };

        await monitoringApi.create(monitoringPayload);
      } catch (monitorErr) {
        console.warn("Failed to create monitoring record:", monitorErr);
      }
      setChecklistState((prev) => ({
        ...prev,
        lastSync: new Date(),
      }));

      // Show success notification
      toast.success("Checklist saved successfully!");
      setSaveStatus("success");
    } catch (error) {
      console.error("Error saving checklist:", error);
      toast.error("Failed to save checklist. Please try again.");
      setSaveStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreciseLocation = async () => {
    setIsLoading(true);
    try {
      const geoData = await fetchGeolocation();

      if (geoData?.error) {
        console.error("Unable to get precise location:", geoData.error);
        return;
      }

      let locationDetails = {};
      if (geoData?.latitude && geoData?.longitude) {
        locationDetails = await getLocationDetails(geoData.latitude, geoData.longitude);
      }

      const resolvedLatitude = locationDetails.latitude || geoData?.latitude || null;
      const resolvedLongitude = locationDetails.longitude || geoData?.longitude || null;

      setChecklistState((prev) => ({
        ...prev,
        latitude: resolvedLatitude || prev.latitude,
        longitude: resolvedLongitude || prev.longitude,
        address: locationDetails.address || prev.address,
        lastSync: new Date(),
      }));

      setMapCenter({
        latitude: resolvedLatitude,
        longitude: resolvedLongitude,
      });
      setMapRecenterVersion((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching precise location:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeedTestComplete = async ({ downloadSpeed, uploadSpeed, latency }) => {
    const resolvedIp =
      checklistState.publicIp && checklistState.publicIp !== "0.0.0.0"
        ? checklistState.publicIp
        : await getPublicIP();

    setChecklistState((prev) => ({
      ...prev,
      downloadSpeed,
      uploadSpeed,
      publicIp: resolvedIp && resolvedIp !== "Unknown" ? resolvedIp : prev.publicIp,
      lastSync: new Date(),
    }));

    try {
      await saveSpeedTestResult(
        downloadSpeed,
        uploadSpeed,
        latency,
        resolvedIp,
        navigator.userAgent,
        navigator.platform,
        JSON.stringify({ downloadSpeed, uploadSpeed, latency, publicIp: resolvedIp })
      );
    } catch (err) {
      console.error("Error saving speed test result:", err);
    }
  };

  const handleLocationSelect = async (latitude, longitude) => {
    setChecklistState((prev) => ({
      ...prev,
      latitude,
      longitude,
    }));
  };

  const handleAddressConfirmed = (confirmedAddress, confirmedLat, confirmedLng) => {
    setChecklistState((prev) => ({
      ...prev,
      address: confirmedAddress,
      latitude: confirmedLat,
      longitude: confirmedLng,
      lastSync: new Date(),
    }));

    setMapCenter({
      latitude: confirmedLat,
      longitude: confirmedLng,
    });
    setMapRecenterVersion((prev) => prev + 1);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Dashboard</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <span className="text-red-500 font-medium">Checklist</span>
            <span>/</span>
            <span>Dashboard</span>
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Save Status Alert */}
      {saveStatus === "success" && (
        <Alert variant="success" icon="shield-tick">
          Checklist has been saved successfully.
        </Alert>
      )}
      {saveStatus === "error" && (
        <Alert variant="danger" icon="information-2">
          Failed to save checklist. Please try again.
        </Alert>
      )}

      {/* Metrics Grid */}
      <MetricsGrid
        downloadSpeed={checklistState.downloadSpeed}
        uploadSpeed={checklistState.uploadSpeed}
        publicIp={checklistState.publicIp}
        onSpeedTestComplete={handleSpeedTestComplete}
        isLoading={isLoading}
      />

      {/* Location and Camera Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <LocationCard
          className="lg:col-span-3"
          address={checklistState.address}
          latitude={checklistState.latitude}
          longitude={checklistState.longitude}
          centerLatitude={mapCenter.latitude}
          centerLongitude={mapCenter.longitude}
          recenterVersion={mapRecenterVersion}
          onLocationSelect={handleLocationSelect}
          onAddressConfirmed={handleAddressConfirmed}
          onPreciseLocation={handlePreciseLocation}
          preciseLoading={isLoading}
        />
        <CameraFeedCard 
          className="lg:col-span-2 lg:self-start"
          status={checklistState.cameraStatus}
          onStatusChange={(cameraStatus) =>
            setChecklistState((prev) => ({
              ...prev,
              cameraStatus,
            }))
          }
          onSave={handleSave}
          loading={isLoading}
          isFormComplete={
            Boolean(checklistState.latitude)
          }
        />
      </div>
    </div>
  );
}
