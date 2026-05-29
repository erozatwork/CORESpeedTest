import { useDataStore } from "@shared/api";

/**
 * Helper to get store actions
 * Provides centralized access to Zustand store actions
 */
const getStoreActions = () => {
  const { actionSelect, actionCreate, actionUpdate, actionDelete } = useDataStore.getState();
  return { actionSelect, actionCreate, actionUpdate, actionDelete };
};

/**
 * Create a new checklist entry
 * @param {Object} data - Checklist data containing speed, location, and device info
 * @returns {Promise<Object>} - Created checklist response
 */
export async function createChecklist(data) {
  const { actionCreate } = getStoreActions();
  return await actionCreate("/api/checklist/create", data);
}

/**
 * Fetch today's checklist
 * @returns {Promise<Object>} - Today's checklist data
 */
export async function getChecklistToday() {
  const { actionSelect } = getStoreActions();
  return await actionSelect("/api/checklist/today");
}

/**
 * Fetch checklist history for last N days
 * @param {number} days - Number of days to fetch (default: 30)
 * @returns {Promise<Array>} - Array of checklist entries
 */
export async function getChecklistHistory(days = 30) {
  const { actionSelect } = getStoreActions();
  return await actionSelect(`/api/checklist/history?days=${days}`);
}

/**
 * Update an existing checklist entry
 * @param {string} checklistId - Checklist ID (GUID)
 * @param {Object} data - Updated checklist data
 * @returns {Promise<Object>} - Updated checklist response
 */
export async function updateChecklist(checklistId, data) {
  const { actionUpdate } = getStoreActions();
  return await actionUpdate(`/api/checklist/update/${checklistId}`, data);
}

/**
 * Delete a checklist entry
 * @param {string} checklistId - Checklist ID (GUID) to delete
 * @returns {Promise<Object>} - Delete response
 */
export async function deleteChecklist(checklistId) {
  const { actionDelete } = getStoreActions();
  return await actionDelete(`/api/checklist/delete/${checklistId}`);
}

/**
 * Get checklist statistics for employee
 * @returns {Promise<Object>} - Statistics object (averages, totals, etc)
 */
export async function getChecklistStats() {
  const { actionSelect } = getStoreActions();
  return await actionSelect("/api/checklist/stats");
}
