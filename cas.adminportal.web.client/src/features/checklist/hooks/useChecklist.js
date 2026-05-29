import { useState, useCallback, useEffect } from "react";
import {
  createChecklist,
  getChecklistToday,
  getChecklistHistory,
  updateChecklist,
  getChecklistStats,
} from "../api/checklist.api";

/**
 * Custom hook for managing checklist functionality
 * Encapsulates all checklist business logic and state management
 * Follows Single Responsibility Principle
 */
export function useChecklist() {
  const [checklistData, setChecklistData] = useState(null);
  const [history, setHistory] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch today's checklist data
   */
  const fetchToday = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getChecklistToday();
      const data = response?.data ?? response?.resultData ?? response ?? null;
      setChecklistData(data);
      return data;
    } catch (err) {
      const status = err?.status ?? err?.statusCode;
      if (status === 404) {
        setChecklistData(null);
        return null;
      }

      const errorMessage = err?.message || "Failed to fetch today's checklist";
      setError(errorMessage);
      console.error("Fetch today error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new checklist entry
   */
  const create = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createChecklist(data);
      const result = response?.data || response;
      setChecklistData(result);
      return result;
    } catch (err) {
      const errorMessage = err?.message || "Failed to create checklist";
      setError(errorMessage);
      console.error("Create error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update an existing checklist entry
   */
  const update = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateChecklist(id, data);
      const result = response?.data || response;
      setChecklistData(result);
      return result;
    } catch (err) {
      const errorMessage = err?.message || "Failed to update checklist";
      setError(errorMessage);
      console.error("Update error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch checklist history for last N days
   * @param {number} days - Number of days to fetch (default: 30)
   */
  const fetchHistory = useCallback(async (days = 30) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getChecklistHistory(days);
      const data = response?.data || response || [];
      setHistory(data);
      return data;
    } catch (err) {
      const errorMessage = err?.message || "Failed to fetch checklist history";
      setError(errorMessage);
      console.error("Fetch history error:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch statistics for the employee
   */
  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getChecklistStats();
      const data = response?.data || response;
      setStatistics(data);
      return data;
    } catch (err) {
      const errorMessage = err?.message || "Failed to fetch statistics";
      setError(errorMessage);
      console.error("Fetch stats error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    checklistData,
    history,
    statistics,
    loading,
    error,

    // Actions
    fetchToday,
    create,
    update,
    fetchHistory,
    fetchStats,
    clearError,
  };
}
