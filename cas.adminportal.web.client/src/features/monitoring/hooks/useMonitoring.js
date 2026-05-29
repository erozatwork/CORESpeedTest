import { useState, useCallback } from "react";
import { monitoringApi } from "../api/monitoringApi";

export const useMonitoring = () => {
  const [monitoringData, setMonitoringData] = useState(null);
  const [pendingMonitoringData, setPendingMonitoringData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const fetchAll = useCallback(async (pageNumber = 1, pageSize = 100) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await monitoringApi.getAll(pageNumber, pageSize);
      if (response.success) {
        setMonitoringData(response.data);
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to fetch monitoring records";
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchEmployeeMonitoring = useCallback(async (days = 30) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await monitoringApi.getEmployeeMonitoring(days);
      if (response.success) {
        setMonitoringData(response.data);
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to fetch employee monitoring";
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await monitoringApi.getStats();
      if (response.success) {
        setStats(response.data);
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to fetch monitoring stats";
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPendingToday = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await monitoringApi.getPendingToday();
      if (response.success) {
        setPendingMonitoringData(response.data);
        return response.data;
      }

      throw new Error(response.message);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to fetch pending employees";
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createMonitoring = useCallback(async (data) => {
    try {
      const response = await monitoringApi.create(data);
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to create monitoring record";
      throw new Error(errorMsg);
    }
  }, []);

  return {
    monitoringData,
    isLoading,
    error,
    stats,
    pendingMonitoringData,
    fetchAll,
    fetchEmployeeMonitoring,
    fetchStats,
    fetchPendingToday,
    createMonitoring,
  };
};
