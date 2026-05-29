import { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@shared/components/ui/card";
import { Button } from "@shared/components/ui/button";
import { RenderCoreIcon } from "@shared/core_icons/CoreIcons";

export default function CameraFeedCard({ 
  className = "",
  status = "offline", 
  lastSeen = "Wed May 20, 12:58 PM",
  onSave = null,
  loading = false,
  isFormComplete = false,
  onStatusChange = null,
  autoStart = true,
}) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const startInFlightRef = useRef(false);
  const [cameraStatus, setCameraStatus] = useState(status);
  const [cameraError, setCameraError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [cameraErrorType, setCameraErrorType] = useState(null);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const getGenericCameraConstraints = () => ({
    video: {
      facingMode: { ideal: "user" },
      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
    audio: false,
  });

  const getExactCameraConstraints = (deviceId) => ({
    video: {
      deviceId: { exact: deviceId },
      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
    audio: false,
  });

  const setCameraErrorState = (errorName, message) => {
    setCameraError(message);
    setCameraErrorType(errorName);
    setCameraStatus("offline");
    onStatusChange?.("offline");
    setIsConnecting(false);
  };

  const startCamera = async () => {
    if (startInFlightRef.current) {
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      const errorMessage = "Camera access is not supported by this browser.";
      setCameraError(errorMessage);
      setCameraErrorType("NotSupportedError");
      setCameraStatus("offline");
      onStatusChange?.("offline");
      return;
    }

    startInFlightRef.current = true;
    setIsConnecting(true);
    setCameraError(null);

    try {
      if (typeof window !== "undefined" && !window.isSecureContext) {
        setCameraErrorState(
          "NotAllowedError",
          "Camera access requires a secure context. Open the app on localhost or HTTPS, then try again."
        );
        return;
      }

      stopStream();

      const devices = navigator.mediaDevices?.enumerateDevices
        ? await navigator.mediaDevices.enumerateDevices()
        : [];

      const videoDevices = devices.filter((device) => device.kind === "videoinput");

      if (videoDevices.length === 0) {
        setCameraErrorState("NotFoundError", "No camera found. Please connect a camera and try again.");
        return;
      }

      const tryStream = async (constraints) => {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          if (videoRef.current.readyState >= 1) {
            // metadata already available
          } else {
            await new Promise((resolve) => {
              const onLoaded = () => {
                try {
                  videoRef.current && videoRef.current.removeEventListener("loadedmetadata", onLoaded);
                } catch (e) {}
                resolve();
              };
              videoRef.current.addEventListener("loadedmetadata", onLoaded);
            });
          }

          await videoRef.current.play();
        }
      };

      let lastDeviceError = null;
      let streamStarted = false;
      const primaryDeviceId = videoDevices[0].deviceId;

      if (primaryDeviceId) {
        try {
          await tryStream(getExactCameraConstraints(primaryDeviceId));
          streamStarted = true;
        } catch (deviceError) {
          lastDeviceError = deviceError;

          if ((deviceError?.name || "UnknownError") === "NotAllowedError") {
            throw deviceError;
          }
        }
      }

      if (!streamStarted) {
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));
          await tryStream(getGenericCameraConstraints());
          streamStarted = true;
        } catch (genericError) {
          throw lastDeviceError || genericError;
        }
      }

      setCameraStatus("online");
      setCameraError(null);
      setCameraErrorType(null);
      setIsConnecting(false);
      onStatusChange?.("online");
    } catch (error) {
      const errorName = error?.name || "UnknownError";

      stopStream();

      if (errorName === "NotReadableError") {
        console.warn("Unable to access camera:", error);
        setCameraErrorState(
          errorName,
          "Camera is already in use by another app. Please close Zoom, Teams, or other apps using the camera and try again."
        );
        return;
      }

      if (errorName === "NotFoundError") {
        console.warn("Unable to access camera:", error);
        setCameraErrorState(errorName, "No camera found. Please connect a camera and try again.");
        return;
      }

      if (errorName === "NotAllowedError") {
        setCameraErrorState(
          errorName,
          "Camera access is blocked by the browser or site policy. Click Enable camera again, or open the app in a top-level tab and check site permissions."
        );
        return;
      }

      console.warn("Unable to access camera:", error);

      if (errorName === "OverconstrainedError") {
        setCameraErrorState(
          errorName,
          "The selected camera settings are not supported by this device. Please try again."
        );
        return;
      }

      setCameraErrorState(errorName, "Unable to connect to the device camera.");
    } finally {
      setIsConnecting(false);
      startInFlightRef.current = false;
    }
  };

  useEffect(() => {
    if (autoStart) {
      void startCamera();
    }

    return () => {
      stopStream();
    };
  }, [autoStart]);

  const isOnline = cameraStatus === "online";
  const isCameraInUse = cameraErrorType === "NotReadableError";
  const statusLabel = isConnecting
    ? "Connecting"
    : isOnline
      ? "Live feed"
      : cameraError
        ? "Camera unavailable"
        : "No signal detected";

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <RenderCoreIcon name="Camera" size={22} className="text-red-500" />
              Camera feed
            </CardTitle>
            <CardDescription>{statusLabel}</CardDescription>
          </div>
          <RenderCoreIcon name="ArrowsOutSimple" size={22} className="text-gray-400 cursor-pointer hover:text-gray-600" />
        </div>
      </CardHeader>

      {/* Camera Feed Display */}
      <div className="px-6 pb-6">
        <div className="relative w-full h-80 bg-black rounded-lg overflow-hidden flex items-center justify-center">
          {/* Status Badge */}
          {!isOnline && !isConnecting && (
            <div className="absolute top-4 right-4 z-20">
              <div className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Offline
              </div>
            </div>
          )}

          {/* Always render video element; toggle visibility via classes so videoRef is available during start */}
          <video
            ref={videoRef}
            className={`h-full w-full object-cover scale-x-[-1] ${isOnline ? "block" : "hidden"}`}
            autoPlay
            muted
            playsInline
          />

          {/* Offline/error UI overlays the video when not online */}
          {!isOnline && (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center px-6">
              <div className="text-center text-white max-w-sm">
                <RenderCoreIcon name="Camera" size={52} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">
                  {isConnecting ? "Connecting to camera..." : "Camera not responding"}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  {cameraError ? cameraError : `Last seen: ${lastSeen}`}
                </p>

                <div className="mt-6 text-sm text-gray-400">
                  Use the Retry button below to reconnect the camera.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Timestamp & Action Buttons */}
      <div className="px-6 py-4 border-t flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <RenderCoreIcon name="Clock" size={16} />
          <span>{new Date().toLocaleString("en-US", { 
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
          })}</span>
        </div>

        {/* Action Buttons */}
        {(onSave || !isOnline) && (
          <div className="flex justify-end gap-3">
            {!isOnline && (
              <Button
                variant="outline"
                onClick={startCamera}
                disabled={loading || isConnecting}
                className="flex items-center gap-2"
              >
                <RenderCoreIcon name="ArrowCounterClockwise" size={16} />
                Retry camera
              </Button>
            )}

            {onSave && (
              <Button
                onClick={onSave}
                disabled={loading || !isFormComplete}
                className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
              >
                <RenderCoreIcon name="FolderPlus" size={16} />
                {loading ? "Saving..." : "Save"}
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
