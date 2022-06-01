import useSWR, { SWRConfiguration } from "swr";
import { IProduct } from "../interfaces";

// const fetcher = (...args: [key: string]) => fetch(...args).then(res => res.json())

/**
 * Custom hook wrapping a SWR hook for fetching data from API
 * @param url: a string with the API endpoint to call
 * @param config: an object with the configuration
 * @returns an object with data and state
 */
export const useProducts = (url: string, config: SWRConfiguration = {}) => {
  // const { data, error } = useSWR<IProduct[]>(`/api/${url}`, fetcher, config)
  const { data, error } = useSWR<IProduct[]>(`/api/${url}`, config);

  return {
    products: data || [],
    isLoading: !error && !data,
    isError: error,
  };
};
