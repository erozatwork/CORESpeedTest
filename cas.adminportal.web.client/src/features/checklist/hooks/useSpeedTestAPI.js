import { useState, useCallback } from "react";
import axios from "@shared/utils/axios";

const API_BASE = "/api/speedtest";

/**
 * Hook for speed test API operations
 */
export function useSpeedTestAPI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Save speed test result
   */
  const saveSpeedTestResult = useCallback(
    async (downloadMbps, uploadMbps, latencyMs, publicIp, clientBrowser, clientOs, rawJson) => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("accessToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await axios.post(
          `${API_BASE}/create`,
          {
            downloadMbps: parseFloat(downloadMbps),
            uploadMbps: parseFloat(uploadMbps),
            latencyMs: latencyMs ? parseFloat(latencyMs) : null,
            publicIp,
            clientBrowser,
            clientOs,
            rawJson: rawJson || JSON.stringify({ downloadMbps, uploadMbps, latencyMs }),
          },
          { headers }
        );

        if (response.data.success) {
          return response.data.data;
        } else {
          throw new Error(response.data.message || "Failed to save speed test result");
        }
      } catch (err) {
        const status = err?.status || err?.response?.status;
        const message = err?.response?.data?.message || err.message || "Error saving speed test result";
        setError(message);

        // If unauthorized, return null so callers can handle gracefully
        if (status === 401) return null;

        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Get speed test history
   */
  const getHistory = useCallback(async (days = 30) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(`${API_BASE}/history`, {
        params: { days },
        headers,
      });

      if (response.data.success) {
        return response.data.data || [];
      } else {
        throw new Error(response.data.message || "Failed to fetch speed test history");
      }
    } catch (err) {
      const status = err?.status || err?.response?.status;
      const message = err.response?.data?.message || err.message || "Error fetching speed test history";
      setError(message);

      if (status === 401) return [];

      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get speed test statistics
   */
  const getStats = useCallback(async (days = 30) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(`${API_BASE}/stats`, {
        params: { days },
        headers,
      });

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch speed test statistics");
      }
    } catch (err) {
      const status = err?.status || err?.response?.status;
      const message = err.response?.data?.message || err.message || "Error fetching speed test statistics";
      setError(message);

      if (status === 401) return null;

      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get latest speed test result
   */
  const getLatest = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(`${API_BASE}/latest`, { headers });

      if (response.data && response.data.success) {
        return response.data.data;
      } else if (response.data && !response.data.success) {
        throw new Error(response.data.message || "Failed to fetch latest speed test");
      }

      return null;
    } catch (err) {
      const status = err?.status || err?.response?.status;
      const message = err.response?.data?.message || err.message || "Error fetching latest speed test";
      setError(message);

      if (status === 401) return null;

      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Delete a speed test result
   */
  const deleteResult = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.delete(`${API_BASE}/delete/${id}`, { headers });

      if (response.data.success) {
        return true;
      } else {
        throw new Error(response.data.message || "Failed to delete speed test result");
      }
    } catch (err) {
      const status = err?.status || err?.response?.status;
      const message = err.response?.data?.message || err.message || "Error deleting speed test result";
      setError(message);

      if (status === 401) return false;

      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    saveSpeedTestResult,
    getHistory,
    getStats,
    getLatest,
    deleteResult,
  };
}
