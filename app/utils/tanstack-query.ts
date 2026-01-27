import { QueryClient, QueryKey, useQuery, useQueryClient, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useEffect } from "react";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export function useCancelableQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): UseQueryResult<TData, TError> {
  const queryClient = useQueryClient()

  const { enabled, queryKey } = options

  useEffect(() => {
    if (enabled === false) {
      alert(`Canceling ${JSON.stringify(queryKey)}`)
      queryClient.cancelQueries({ queryKey })
    }
  }, [enabled, queryKey, queryClient])

  return useQuery(options)
}