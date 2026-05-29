const clampSpeed = (value) => Math.max(0.1, Math.min(Number(value) || 0, 9999.9));
const MAX_CRYPTO_CHUNK_BYTES = 65536;
const DEFAULT_PROBE_BASE_URL = "/api/speedtest/probe";

const normalizeBaseUrl = (baseUrl) => {
  const candidate = (baseUrl || DEFAULT_PROBE_BASE_URL).trim();
  return candidate.endsWith("/") ? candidate.slice(0, -1) : candidate;
};

function fillRandomBytes(data) {
  if (window.crypto?.getRandomValues) {
    for (let offset = 0; offset < data.length; offset += MAX_CRYPTO_CHUNK_BYTES) {
      const end = Math.min(offset + MAX_CRYPTO_CHUNK_BYTES, data.length);
      window.crypto.getRandomValues(data.subarray(offset, end));
    }
    return;
  }

  for (let i = 0; i < data.length; i += 1) {
    data[i] = Math.floor(Math.random() * 256);
  }
}

const getUploadFallbackMbps = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const estimated = connection?.downlink || 0;
  return clampSpeed(estimated * 0.7 || 0.5);
};

const averageTrimmedSamples = (samples) => {
  if (!samples.length) return 0;
  if (samples.length <= 2) {
    return samples.reduce((sum, value) => sum + value, 0) / samples.length;
  }

  const sorted = [...samples].sort((left, right) => left - right);
  const trimmed = sorted.slice(1, -1);
  return trimmed.reduce((sum, value) => sum + value, 0) / trimmed.length;
};

const TOTAL_SPEED_SAMPLES = 5;
const TOTAL_LATENCY_SAMPLES = 3;

export async function measureDownloadSpeed(fileSize = 10 * 1024 * 1024, options = {}) {
  const baseUrl = normalizeBaseUrl(options.baseUrl);
  const onProgress = typeof options.onProgress === "function" ? options.onProgress : null;

  const samples = [];

  for (let attempt = 0; attempt < TOTAL_SPEED_SAMPLES; attempt += 1) {
    const cacheBuster = `${Date.now()}-${attempt}`;
    const url = `${baseUrl}/download?sizeBytes=${fileSize}&_=${cacheBuster}`;

    try {
      const startTime = performance.now();
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Download probe failed with status ${response.status}`);
      }

      const buffer = await response.arrayBuffer();
      const seconds = (performance.now() - startTime) / 1000;

      if (seconds < 0.01) {
        samples.push(getUploadFallbackMbps());
        continue;
      }

      const bits = buffer.byteLength * 8;
      samples.push(clampSpeed((bits / 1000000) / seconds));
    } catch (error) {
      console.error("Download speed test failed", error);
      samples.push(getUploadFallbackMbps());
    }

    if (onProgress) {
      onProgress({
        stage: "download",
        progress: ((attempt + 1) / TOTAL_SPEED_SAMPLES) * 100,
      });
    }
  }

  return clampSpeed(averageTrimmedSamples(samples));
}

export async function measureUploadSpeed(dataSize = 5 * 1024 * 1024, options = {}) {
  const baseUrl = normalizeBaseUrl(options.baseUrl);
  const onProgress = typeof options.onProgress === "function" ? options.onProgress : null;

  const samples = [];

  for (let attempt = 0; attempt < TOTAL_SPEED_SAMPLES; attempt += 1) {
    const data = new Uint8Array(dataSize);
    fillRandomBytes(data);
    const uploadUrl = `${baseUrl}/upload?_=${Date.now()}-${attempt}`;

    const sample = await new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      let startTime = performance.now();
      let hasTransferStarted = false;
      let loaded = 0;

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          loaded = event.loaded;
        }

        if (!hasTransferStarted) {
          startTime = performance.now();
          hasTransferStarted = true;
        }
      };

      const finalize = () => {
        const seconds = (performance.now() - startTime) / 1000;
        const bytes = loaded || dataSize;
        if (seconds < 0.01) {
          resolve(getUploadFallbackMbps());
          return;
        }

        const bits = bytes * 8;
        resolve(clampSpeed((bits / 1000000) / seconds));
      };

      xhr.onload = finalize;
      xhr.onerror = finalize;
      xhr.onabort = finalize;
      xhr.ontimeout = finalize;

      xhr.timeout = 15000;

      try {
        // Same-origin POST probe; the response status is irrelevant because we measure time-to-complete.
        xhr.open("POST", uploadUrl, true);
        xhr.setRequestHeader("Content-Type", "application/octet-stream");
        xhr.send(data);
      } catch (error) {
        console.error("Upload speed test failed", error);
        resolve(getUploadFallbackMbps());
      }
    });

    samples.push(sample);

    if (onProgress) {
      onProgress({
        stage: "upload",
        progress: ((attempt + 1) / TOTAL_SPEED_SAMPLES) * 100,
      });
    }
  }

  return clampSpeed(averageTrimmedSamples(samples));
}

export async function measureLatency(options = {}) {
  const baseUrl = normalizeBaseUrl(options.baseUrl);
  const onProgress = typeof options.onProgress === "function" ? options.onProgress : null;

  const samples = [];

  try {
    for (let attempt = 0; attempt < TOTAL_LATENCY_SAMPLES; attempt += 1) {
      const startTime = performance.now();
      const response = await fetch(`${baseUrl}/ping?ts=${Date.now()}-${attempt}`, {
        method: "GET",
        cache: "no-store",
        credentials: "same-origin",
      });
      if (!response.ok) {
        throw new Error(`Ping probe failed with status ${response.status}`);
      }

      await response.text();
      const latency = performance.now() - startTime;
      samples.push(Math.max(1, Math.min(latency, 999)));

      if (onProgress) {
        onProgress({
          stage: "ping",
          progress: ((attempt + 1) / TOTAL_LATENCY_SAMPLES) * 100,
        });
      }
    }

    const sorted = [...samples].sort((left, right) => left - right);
    const trimmed = sorted.slice(0, -1);
    return trimmed.reduce((sum, value) => sum + value, 0) / trimmed.length;
  } catch (error) {
    console.error("Latency test error:", error);
    return 0;
  }
}

export async function runSpeedTest(options = {}) {
  const {
    downloadSize = 10 * 1024 * 1024,
    uploadSize = 5 * 1024 * 1024,
    probeBaseUrl = DEFAULT_PROBE_BASE_URL,
  } = options;

  try {
    const latencyMs = await measureLatency({
      baseUrl: probeBaseUrl,
    });
    const downloadMbps = await measureDownloadSpeed(downloadSize, {
      baseUrl: probeBaseUrl,
    });
    const uploadMbps = await measureUploadSpeed(uploadSize, {
      baseUrl: probeBaseUrl,
    });

    return {
      downloadMbps: parseFloat(downloadMbps.toFixed(2)),
      uploadMbps: parseFloat(uploadMbps.toFixed(2)),
      latencyMs: parseFloat(latencyMs.toFixed(2)),
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Speed test error:", error);
    return {
      downloadMbps: 0,
      uploadMbps: 0,
      latencyMs: 0,
      timestamp: new Date().toISOString(),
      error: error.message,
    };
  }
}

export async function runSpeedTestWithProgress(options = {}) {
  const { onProgress = null, probeBaseUrl = DEFAULT_PROBE_BASE_URL } = options;

  const results = {};

  try {
    if (onProgress) onProgress({ stage: "ping", progress: 0 });
    results.latencyMs = await measureLatency({ baseUrl: probeBaseUrl, onProgress });
    if (onProgress) onProgress({ stage: "ping", progress: 100 });

    if (onProgress) onProgress({ stage: "download", progress: 0 });
    results.downloadMbps = await measureDownloadSpeed(10 * 1024 * 1024, { baseUrl: probeBaseUrl, onProgress });
    if (onProgress) onProgress({ stage: "download", progress: 100 });

    if (onProgress) onProgress({ stage: "upload", progress: 0 });
    results.uploadMbps = await measureUploadSpeed(5 * 1024 * 1024, { baseUrl: probeBaseUrl, onProgress });
    if (onProgress) onProgress({ stage: "upload", progress: 100 });

    results.timestamp = new Date().toISOString();
    return results;
  } catch (error) {
    console.error("Speed test error:", error);
    return {
      ...results,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
}
