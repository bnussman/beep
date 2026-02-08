import '../utils/instrument';
import React, { useEffect } from "react";
import * as Sentry from "@sentry/react-native";
import { SplashScreen, Stack, useNavigationContainerRef } from 'expo-router';
import { queryClient, trpcClient, TRPCProvider, useTRPC } from "@/utils/trpc";
import { QueryClientProvider, useQuery, useQueryClient } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useColorScheme } from "react-native";
import { useAutoUpdate } from "@/utils/updates";
import { useSubscription } from "@trpc/tanstack-react-query";
import { setupNotifications, updatePushToken } from "@/utils/notifications";
import { setPurchaseUser, setupPurchase } from "@/utils/purchase";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { navigationIntegration } from '../utils/instrument';

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

  return (
    <Stack
      screenOptions={{
        headerTintColor: colorScheme === "dark" ? "white" : "black",
        headerBackButtonDisplayMode: "generic",
      }}
    >
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen options={{ headerShown: false }} name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen options={{ headerShown: false }} name="(auth)/index" />
        <Stack.Screen options={{ headerTitle: "Sign Up"}} name="(auth)/sign-up" />
        <Stack.Screen options={{ headerTitle: "Forgot Password"}} name="(auth)/forgot-password" />
      </Stack.Protected>
    </Stack> 
  );
}

function Layout() {
  const ref = useNavigationContainerRef();
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (ref) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

  return (
    <GestureHandlerRootView>
      <KeyboardProvider>
        <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider value={
              colorScheme === "dark"
                ? DarkTheme
                : {
                  ...DefaultTheme,
                  colors: { ...DefaultTheme.colors, background: "white" },
                }}
            >
              <App />
            </ThemeProvider>
          </QueryClientProvider>
        </TRPCProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(Layout);

export const unstable_settings = {
  initialRouteName: '(auth)/index',
};

