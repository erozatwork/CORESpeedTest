import axios from "axios";
// config
import { config } from "@shared/config/api.config";

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: config.API_URL });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    );
  }
);

export default axiosInstance;
