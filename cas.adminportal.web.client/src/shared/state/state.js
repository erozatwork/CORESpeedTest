import { create } from "zustand";
import { useLoading } from "@shared/hooks";

const initialState = {
  loading: false,
  success: false,
  error: false,
  data: [],
  errorData: null,
};

/**
 * REFERENCE: https://zustand.docs.pmnd.rs/guides/immutable-state-and-merging
 * && https://dev.to/androbro/simplifying-data-fetching-with-zustand-and-tanstack-query-one-line-to-rule-them-all-3k87
 * */

const useLoaderStore = create((set) => ({
  ...initialState,
  setIsLoading: (isLoading, errorData, error) =>
    set({
      ...initialState,
      loading: isLoading,
      errorData: errorData,
      error: error,
    }),
}));

const useInitialize = ({ isLoading }) => {
  const { setIsLoading } = useLoaderStore();
  useLoading(isLoading, setIsLoading);
};

export { useInitialize, initialState };
