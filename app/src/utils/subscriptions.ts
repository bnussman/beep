import { consumeAsyncIterator, PromiseWithError } from "@orpc/client";
import { QueryKey, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

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
    if (query.data !== undefined && options.onData) {
      options.onData(query.data as TQueryFnData);
    }
  }, [query.data]);

  return query;
}

interface SubOptions<T> {
  onData: (data: T) => void;
  enabled: boolean;
  iterator: () => AsyncIterator<T> | PromiseWithError<AsyncIterator<T>, unknown>;
}

export function useSub<T>(options: SubOptions<T>) {
  const { enabled, onData, iterator } = options;
  const cancelRef = useRef<() => void>(null);

  const startSubscription = () => {
    if (!cancelRef.current) {
      cancelRef.current = consumeAsyncIterator(iterator(), {
        onEvent: (event) => {
          console.log(event)
          onData(event);
        },
        onError: (error) => {
          console.error(error)
        },
        onSuccess: (value) => {
          console.log(value)
        },
        onFinish: (state) => {
          console.log(state)
        },
      })
    }
  };

  const stopSubscription = () => {
    if (cancelRef.current) {
      cancelRef.current();
      cancelRef.current = null;
    }
  };

  useEffect(() => {
    if (enabled === undefined || enabled) {
      startSubscription();
    }

    if (enabled === false) {
      stopSubscription();
    }

    return () => {
      stopSubscription();
    }
  }, [enabled]);

  return null;
}