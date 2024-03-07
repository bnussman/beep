import "react-native-gesture-handler";
import React, { useEffect } from "react";
import config from "./package.json";
import * as SplashScreen from "expo-splash-screen";
import * as Sentry from "@sentry/react-native";
import { cache, client } from "./utils/Apollo";
import { ApolloProvider, useSubscription } from "@apollo/client";
import { updatePushToken } from "./utils/Notifications";
import { UserData, UserSubscription, useUser } from "./utils/useUser";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { setUserContext } from "./utils/sentry";
import { StatusBar } from "expo-status-bar";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { setPurchaseUser, setupPurchase } from "./utils/purchase";
import { Navigation } from "./utils/Navigation";
import { useAutoUpdate } from "./utils/updates";
import { TamaguiProvider, tamaguiConfig } from "@beep/ui";
import { useColorScheme } from "react-native";
import { queryClient, trpc, trpcClient } from "./utils/trpc";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";

SplashScreen.preventAutoHideAsync();
Sentry.init({
  release: config.version,
  dsn: "https://22da81efd1744791aa86cfd4bf8ea5eb@o1155818.ingest.sentry.io/6358990",
  enableAutoSessionTracking: true,
  enableAutoPerformanceTracing: true,
});

setupPurchase();

function Beep() {
  const colorScheme = useColorScheme();
  const { data, loading } = useUser({
    errorPolicy: "none",
    onCompleted: () => {
      updatePushToken();
    },
  });

  const { data: d } = trpc.userList.useQuery();
  const { mutateAsync } = trpc.updateUser.useMutation();

  const utils = trpc.useUtils();

  useAutoUpdate();

  const user = data?.getUser;

  useSubscription(UserSubscription, {
    onData({ data }) {
      cache.updateQuery({ query: UserData }, () => ({ getUser: data.data!.getUserUpdates }));
    },
    skip: !user,
  });

  useEffect(() => {
    if (user) {
      setPurchaseUser(user);
      setUserContext(user);
    }
  }, [user]);

  if (loading) {
    return null;
  }

  return (
    <>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Navigation
        linking={{ enabled: true, prefixes: ["beep://", "https://app.ridebeep.app"] }}
        theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      />
    </>
  );
}

function App() {
  const colorScheme = useColorScheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme  ?? "light"}>
        <ApolloProvider client={client}>
          <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
              <Beep />
            </QueryClientProvider>
          </trpc.Provider>
        </ApolloProvider>
      </TamaguiProvider>
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(App);
