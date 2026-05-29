import httpClient from "@shared/api/httpClient";

const API_BASE = "/api/monitoring";

export const monitoringApi = {
  /**
   * Get all monitoring records with pagination
   */
  getAll: async (pageNumber = 1, pageSize = 100) => {
    try {
      const response = await httpClient.get(`${API_BASE}/all`, {
        params: { pageNumber, pageSize },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get monitoring records for current employee
   */
  getEmployeeMonitoring: async (days = 30) => {
    try {
      const response = await httpClient.get(`${API_BASE}/employee`, {
        params: { days },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get a specific monitoring record by ID
   */
  getById: async (id) => {
    try {
      const response = await httpClient.get(`${API_BASE}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get monitoring statistics
   */
  getStats: async () => {
    try {
      const response = await httpClient.get(`${API_BASE}/stats/overview`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get employees who are pending today's checklist submission
   */
  getPendingToday: async () => {
    try {
      const response = await httpClient.get(`${API_BASE}/pending/today`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new monitoring record (called from checklist save)
   */
  create: async (monitoringData) => {
    try {
      const response = await httpClient.post(`${API_BASE}/create`, monitoringData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
