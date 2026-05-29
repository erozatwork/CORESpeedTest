/**
 * Internet Speed Test Utility
 * Uses LibreSpeed for accurate download/upload speed measurement
 */

import {
  runSpeedTest,
  runSpeedTestWithProgress,
  measureDownloadSpeed as librespeedDownload,
  measureUploadSpeed as librespeedUpload,
  measureLatency,
} from "./librespeedClient";

/**
 * Measure download speed using LibreSpeed
 * @param {string} serverUrl - Optional custom LibreSpeed server URL
 * @returns {Promise<number>} - Download speed in Mbps
 */
export async function measureDownloadSpeed(serverUrl = "/api/speedtest/probe", options = {}) {
  try {
    const speed = await librespeedDownload(10 * 1024 * 1024, {
      baseUrl: serverUrl,
      onProgress: options.onProgress,
    });
    return speed;
  } catch (error) {
    console.error("Download speed test error:", error);
    return null;
  }
}

/**
 * Measure upload speed using LibreSpeed
 * @param {string} serverUrl - Optional custom LibreSpeed server URL
 * @returns {Promise<number>} - Upload speed in Mbps
 */
export async function measureUploadSpeed(serverUrl = "/api/speedtest/probe", options = {}) {
  try {
    const speed = await librespeedUpload(5 * 1024 * 1024, {
      baseUrl: serverUrl,
      onProgress: options.onProgress,
    });
    return speed;
  } catch (error) {
    console.error("Upload speed test error:", error);
    return null;
  }
}

/**
 * Quick speed test - measures both download and upload
 * @param {Object} options - Configuration options
 * @returns {Promise<Object>} - { downloadSpeed, uploadSpeed, latency, timestamp }
 */
export async function quickSpeedTest(options = {}) {
  try {
    const results = await runSpeedTest(options);
    
    return {
      downloadSpeed: results.downloadMbps,
      uploadSpeed: results.uploadMbps,
      latency: results.latencyMs,
      timestamp: results.timestamp,
      error: results.error || null,
    };
  } catch (error) {
    console.error("Speed test error:", error);
    return {
      downloadSpeed: null,
      uploadSpeed: null,
      latency: null,
      timestamp: new Date().toISOString(),
      error: error.message,
    };
  }
}

/**
 * Speed test with progress callback
 * @param {Object} options - Configuration options including onProgress callback
 * @returns {Promise<Object>} - Test results with progress tracking
 */
export async function speedTestWithProgress(options = {}) {
  return runSpeedTestWithProgress(options);
}
