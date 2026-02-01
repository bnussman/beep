import { QueryClient, QueryKey, useQuery, useQueryClient, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AppState, AppStateStatus } from "react-native";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const useAppState = () => {
  const [appState, setAppState] = useState<AppStateStatus>('active');

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return appState;
}

export function useCancelableQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): UseQueryResult<TData, TError> {
  const appState = useAppState();
  const queryClient = useQueryClient();

  const enabled = appState === 'active' && (options.enabled === undefined || options.enabled)

  // console.log(options.queryKey, enabled, appState)

  useEffect(() => {
    if (!enabled) {
      queryClient.cancelQueries({ queryKey: options.queryKey })
    }
  }, [enabled, options.queryKey, queryClient])

  return useQuery({ ...options, enabled })
}