import axios from "axios";
import { GETSESSION } from "@features/auth/utils";

// ----------------------------------------------------------------------

// Create axios instance with base configuration
const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach auth token
httpClient.interceptors.request.use(
  (config) => {
    // Get token from session/localStorage
    const token = GETSESSION();

    if (token) {
      config.headers.authorization = token;
    }

    // Don't set Content-Type for FormData (let browser set it with boundary)
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common error scenarios
    if (error.response) {
      // Server responded with error status
      return Promise.reject(error.response.data || "Something went wrong");
    } else if (error.request) {
      // Request made but no response received
      return Promise.reject("No response from server");
    } else {
      // Error in request setup
      return Promise.reject(error.message || "Request failed");
    }
  }
);

export default httpClient;
