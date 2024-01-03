import { useQuery, useSubscription } from "@apollo/client";
import { UserDataQuery, UserUpdatesSubscription } from "../../generated/graphql";
import { UserData, UserSubscription } from "../../utils/useUser";
import { updatePushToken } from "../../utils/Notifications";
import { cache } from "../../utils/Apollo";
import { useEffect } from "react";
import { setPurchaseUser } from "../../utils/purchase";
import { setUserContext } from "../../utils/sentry";
import { Redirect } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { Text, useColorMode } from "native-base";
import { CustomDrawerContent } from "../../components/Drawer";
import { SplashScreen } from "expo-router";
import { Logger } from "../../utils/Logger";

export default function AppLayout() {
  const { colorMode } = useColorMode();
  const { data, loading } = useQuery<UserDataQuery>(UserData, {
    errorPolicy: "none",
    onCompleted: () => {
      updatePushToken();
      try {
        SplashScreen.hideAsync();
      } catch (error) {
        Logger.error(error);
      }
    },
  });

  const user = data?.getUser;

  useSubscription<UserUpdatesSubscription>(UserSubscription, {
    onData({ data }) {
      cache.updateQuery<UserDataQuery>({ query: UserData }, () => ({ getUser: data.data!.getUserUpdates }));
    },
    skip: !user,
  });

  useEffect(() => {
    if (user) {
      setPurchaseUser(user);
      setUserContext(user);
    }
  }, [user]);

 // You can keep the splash screen open, or render a loading screen like we do here.
  if (loading) {
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!user) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/login" />;
  }

  // This layout can be deferred because it's not the root layout.
  return (
    <Drawer
      initialRouteName="ride"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerType: "front",
        headerTintColor: colorMode === "dark" ? "white" : "black",
      }}
    />
  );
}
