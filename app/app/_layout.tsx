import React, { useEffect } from "react";
import * as Sentry from "@sentry/react-native";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from 'expo-router';
import { queryClient, trpcClient, TRPCProvider, useTRPC } from "@/utils/trpc";
import { QueryClientProvider, useQuery, useQueryClient } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useColorScheme } from "react-native";
import { useAutoUpdate } from "@/utils/updates";
import { useSubscription } from "@trpc/tanstack-react-query";
import { setupNotifications, updatePushToken } from "@/utils/notifications";
import { setPurchaseUser, setupPurchase } from "@/utils/purchase";

SplashScreen.preventAutoHideAsync();

setupPurchase();
setupNotifications();

function App() {
  const trpc = useTRPC();
  const colorScheme = useColorScheme();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery(
    trpc.user.me.queryOptions(undefined, {
      retry: false,
    }),
  );

  useAutoUpdate();

  useSubscription(
    trpc.user.updates.subscriptionOptions(undefined, {
      enabled: user !== undefined,
      onData(user) {
        queryClient.setQueryData(trpc.user.me.queryKey(), user);
      },
    }),
  );

  useEffect(() => {
    if (user) {
      Sentry.setUser(user);
      updatePushToken();
      setPurchaseUser(user);
    }
  }, [user]);

  if (isLoading) {
    return null;
  }

  const isLoggedIn = user !== undefined;

  console.log(user, isLoggedIn)

  return (
   <Stack screenOptions={{
      headerTintColor: colorScheme === "dark" ? "white" : "black",
      headerBackButtonDisplayMode: "generic",
    }}>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="create-account" />
      </Stack.Protected>
    </Stack> 
  );
}

export default function Layout() {
  return (
    <GestureHandlerRootView>
      <KeyboardProvider>
        <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </TRPCProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}