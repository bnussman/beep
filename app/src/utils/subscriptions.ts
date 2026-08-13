import { QueryKey, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";

interface Options<TQueryFnData = unknown, TError = Error, TData = TQueryFnData, TQueryKey extends QueryKey = readonly unknown[]> extends UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> {
  onData?: (data: TQueryFnData) => void;
}

export function useSubscription<TQueryFnData = unknown, TError = Error, TData = TQueryFnData, TQueryKey extends QueryKey = readonly unknown[]>(options: Options<TQueryFnData, TError, TData, TQueryKey>) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!options.enabled) {
      queryClient.cancelQueries({ queryKey: options.queryKey })
    }
  }, [options.enabled]);

  const query = useQuery<TQueryFnData, TError, TData, TQueryKey>(options);

  useEffect(() => {
    if (query.data && options.onData) {
      options.onData(query.data as TQueryFnData);
    }
  }, [query.data]);

  return query;
}
