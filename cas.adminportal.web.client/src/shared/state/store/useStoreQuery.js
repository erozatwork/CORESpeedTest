// useStoreQuery.js
import { useQuery } from "react-query";
import qs from "qs";
import axios from "@shared/utils/axios";
import { GETSESSION } from "@features/auth/utils";
import { useInitialize } from "../state";

export const useStoreQuery = ({
  payload = {},
  url,
  enabled = true,
  requestMethod = "post",
  queryKey,
}) => {
  const token = GETSESSION();
  // GETSESSION() already returns the token prefixed with 'Bearer ' in this codebase.
  // Avoid double-prefixing (e.g. 'Bearer Bearer <token>'). Use the value as-is.
  const authHeader = token ? { Authorization: token } : {};

  const fetchData = async () => {
    if (requestMethod === "post") {
      return axios.post(url, qs.stringify(payload), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          ...authHeader,
        },
      });
    }
    // GET
    return axios.get(url, {
      params: payload,
      headers: { ...authHeader },
    });
  };

  const {
    data: getData,
    isLoading,
    refetch: load,
    error,
    isError,
  } = useQuery(
    [queryKey, JSON.stringify(payload)], // serialize for stable key
    fetchData,
    {
      retry: 0,
      enabled,
      cacheTime: 10000, // v3 uses cacheTime
      keepPreviousData: true,
    }
  );

  useInitialize({ isLoading, errorData: isError, error });

  return { getData, isLoading, load, error };
};
