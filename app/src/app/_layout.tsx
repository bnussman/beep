import "@/utils/instrument";
import "../global.css";
import { useEffect } from "react";
import * as Sentry from "@sentry/react-native";
import { SplashScreen, Stack, useNavigationContainerRef } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useColorScheme } from "react-native";
import { useAutoUpdate } from "@/utils/updates";
import { setupNotifications, updatePushToken } from "@/utils/notifications";
import { setPurchaseUser, setupPurchase } from "@/utils/purchase";
import { navigationIntegration } from "@/utils/instrument";
import { HeroUINativeProvider } from "heroui-native";
import { setupLiveActivityListeners } from "@/live-activities/utils";
import { orpc } from "@/utils/orpc";
import { queryClient } from "@/utils/tanstack-query";
import { useSubscription } from "@/utils/subscriptions";
import {
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "expo-router/react-navigation";

if (!global.AbortSignal.prototype.throwIfAborted) {
  console.log("PATCHING")
  global.AbortSignal.prototype.throwIfAborted = function throwIfAborted() {
    if (this.aborted) {
      throw new Error('Aborted');
    }
  };
}

SplashScreen.preventAutoHideAsync();

setupPurchase();
setupNotifications();
setupLiveActivityListeners();

function App() {
  const colorScheme = useColorScheme();
  const queryClient = useQueryClient();

  useAutoUpdate();

  const { data: user, isLoading } = useQuery(
    orpc.user.me.queryOptions({ retry: false })
  );

  useSubscription({
    ...orpc.user.updates.liveOptions({
      enabled: user !== undefined,
      context: { ws: true }
    }),
    onData(data) {
      queryClient.setQueryData(orpc.user.me.queryKey(), data);
    },
  });

  useEffect(() => {
    Sentry.setUser(user ?? null);
    setPurchaseUser(user ?? null);
  }, [user]);

  useEffect(() => {
    if (user) {
      updatePushToken();
    }
  }, [isLoading]);

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
        <Stack.Screen options={{ headerShown: false }} name="(tabs)" />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen options={{ headerShown: false }} name="(auth)/index" />
        <Stack.Screen
          options={{ headerTitle: "Sign Up" }}
          name="(auth)/sign-up"
        />
        <Stack.Screen
          options={{ headerTitle: "Forgot Password" }}
          name="(auth)/forgot-password"
        />
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
      <HeroUINativeProvider>
        <KeyboardProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider
              value={
                colorScheme === "dark"
                  ? DarkTheme
                  : {
                      ...DefaultTheme,
                      colors: {
                        ...DefaultTheme.colors,
                        background: "#fafafa",
                      },
                    }
              }
            >
              <App />
            </ThemeProvider>
          </QueryClientProvider>
        </KeyboardProvider>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(Layout);

export const unstable_settings = {
  initialRouteName: "(auth)/index",
};
