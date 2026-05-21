import { create } from "zustand";
import httpClient from "./httpClient";

// Helper function to handle API requests with consistent error handling
const handleRequest = async (set, requestFn) => {
  set({ loading: true, error: null, success: false });
  try {
    const result = await requestFn();
    set({ loading: false, success: true, error: null });
    return result;
  } catch (err) {
    set({ loading: false, error: err, success: false });
    throw err; // Re-throw to allow caller to handle errors
  }
};

const useDataStore = create((set) => ({
  loading: false,
  error: null,
  success: false,

  actionCreate: (path, data) =>
    handleRequest(set, async () => {
      const res = await httpClient.post(path, data);
      return res.data;
    }),

  actionUpdate: (path, data) =>
    handleRequest(set, async () => {
      const res = await httpClient.put(path, data);
      return res.data;
    }),

  actionDelete: (path, data) =>
    handleRequest(set, async () => {
      const res = await httpClient.delete(`${path}?t=${data.id}`);
      return res.data;
    }),

  actionSelect: (path, params = {}) =>
    handleRequest(set, async () => {
      const res = await httpClient.get(path, { params });
      return res.data;
    }),

  actionSelectTable: (path, data) =>
    handleRequest(set, async () => {
      const res = await httpClient.post(path, data);
      return res.data;
    }),
}));

export { useDataStore };
