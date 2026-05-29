/**
 * Device Status Detector
 * Monitors device connectivity, battery, and camera status
 */

/**
 * Get device online/offline status
 * @returns {boolean} - True if device is online
 */
export function getDeviceStatus() {
  return navigator.onLine ? "online" : "offline";
}

/**
 * Get network connection type
 * @returns {Promise<string>} - Connection type (4g, 3g, 2g, wifi, etc)
 */
export function getNetworkType() {
  try {
    if (!navigator.connection && !navigator.mozConnection) {
      return "unknown";
    }

    const connection =
      navigator.connection || navigator.mozConnection;
    const type = connection.effectiveType || connection.type || "unknown";

    return type;
  } catch (error) {
    console.warn("Network type detection error:", error);
    return "unknown";
  }
}

/**
 * Get signal strength
 * @returns {string} - Signal strength: 'strong', 'medium', 'weak'
 */
export function getSignalStrength() {
  try {
    if (!navigator.connection && !navigator.mozConnection) {
      return getDeviceStatus() === "online" ? "strong" : "offline";
    }

    const connection =
      navigator.connection || navigator.mozConnection;
    const type = connection.effectiveType || connection.type || "";

    if (type === "4g" || type === "wifi") {
      return "strong";
    } else if (type === "3g" || type === "lte") {
      return "medium";
    } else if (type === "2g" || type === "slow-2g") {
      return "weak";
    }

    return "medium";
  } catch (error) {
    console.warn("Signal strength detection error:", error);
    return "unknown";
  }
}

/**
 * Get battery status
 * @returns {Promise<Object>} - { level, charging, status }
 */
export async function getBatteryStatus() {
  try {
    if (!navigator.getBattery) {
      // Fallback to Battery Status API if available
      if (navigator.battery) {
        return {
          level: Math.round(navigator.battery.level * 100),
          charging: navigator.battery.charging,
          status: "available",
        };
      }
      return {
        level: 100,
        charging: true,
        status: "unavailable",
      };
    }

    const battery = await navigator.getBattery();
    return {
      level: Math.round(battery.level * 100),
      charging: battery.charging,
      status: "available",
    };
  } catch (error) {
    console.warn("Battery status detection error:", error);
    return {
      level: 100,
      charging: true,
      status: "unavailable",
    };
  }
}

/**
 * Check camera availability
 * @returns {Promise<string>} - Camera status: 'available', 'unavailable', 'unknown'
 */
export async function getCameraStatus() {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return "unknown";
    }

    const devices = await navigator.mediaDevices.enumerateDevices();
    const hasCamera = devices.some((device) => device.kind === "videoinput");

    return hasCamera ? "available" : "unavailable";
  } catch (error) {
    console.warn("Camera status detection error:", error);
    return "unknown";
  }
}

/**
 * Get all device status information
 * @returns {Promise<Object>} - Complete device status
 */
export async function getCompleteDeviceStatus() {
  const batteryStatus = await getBatteryStatus();
  const cameraStatus = await getCameraStatus();

  return {
    deviceStatus: getDeviceStatus(),
    networkType: getNetworkType(),
    signal: getSignalStrength(),
    battery: batteryStatus.level,
    batteryCharging: batteryStatus.charging,
    cameraStatus: cameraStatus === "available" ? "online" : "offline",
    timestamp: new Date().toISOString(),
  };
}
