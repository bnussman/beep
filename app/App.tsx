import "react-native-gesture-handler";
import React, { useEffect } from "react";
import config from "./package.json";
import * as SplashScreen from "expo-splash-screen";
import * as Sentry from "@sentry/react-native";
import { cache, client } from "./utils/apollo";
import { ApolloProvider, useSubscription } from "@apollo/client";
import { updatePushToken } from "./utils/notifications";
import { UserData, UserSubscription, useUser } from "./utils/useUser";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { setUserContext } from "./utils/sentry";
import { StatusBar } from "expo-status-bar";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { setPurchaseUser, setupPurchase } from "./utils/purchase";
import { Navigation } from "./utils/navigation";
import { useAutoUpdate } from "./utils/updates";
import { useColorScheme } from "react-native";
import * as Notifications from "expo-notifications";
import { UpdateBeeperQueue } from "./components/ActionButton";
import { Status } from "./utils/types";
import "./global.css";

Notifications.setNotificationCategoryAsync(
  "newbeep",
  [
    {
      identifier: "accept",
      buttonTitle: "Accept",
      options: {
        opensAppToForeground: false,
      },
    },
    {
      identifier: "deny",
      buttonTitle: "Deny",
      options: {
        isDestructive: true,
        opensAppToForeground: false,
      },
    },
  ],
  {
    allowInCarPlay: true,
    allowAnnouncement: true,
  },
);

Notifications.addNotificationResponseReceivedListener((response) => {
  console.log(response.actionIdentifier);
  if (
    // @ts-expect-error expo is lieing
    response.notification.request.content.categoryIdentifier === "newbeep" &&
    response.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER
  ) {
    client.mutate({
      mutation: UpdateBeeperQueue,
      variables: {
        id: response.notification.request.content.data.id,
        status:
          response.actionIdentifier === "accept"
            ? Status.ACCEPTED
            : Status.DENIED,
      },
    });
  }
});

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

  // const { data: user } = trpc.me.useQuery();
  // console.log(user);

  useAutoUpdate();

  const user = data?.getUser;

  useSubscription(UserSubscription, {
    onData({ data }) {
      cache.updateQuery({ query: UserData }, () => ({
        getUser: data.data!.getUserUpdates,
      }));
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
        linking={{
          enabled: "auto",
          prefixes: ["beep://", "https://app.ridebeep.app"],
        }}
        theme={colorScheme === "dark" ? DarkTheme : { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: 'white' } }}
      />
    </>
  );
}

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ApolloProvider client={client}>
        <Beep />
      </ApolloProvider>
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(App);
