import { Redirect } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { Text } from 'react-native';
import { UserData, UserSubscription } from '../../utils/useUser';
import { useQuery } from '@apollo/client';
import { UserDataQuery } from '../../generated/graphql';
import { handleNotification, updatePushToken } from '../../utils/Notifications';
import { useEffect } from 'react';
import { setUserContext } from '../../utils/sentry';
import * as Notifications from "expo-notifications";
import { CustomDrawerContent } from '../../navigators/Drawer';

let unsubscribe: (() => void) | null = null;

export default function AppLayout() {
  const { data, loading, subscribeToMore } = useQuery<UserDataQuery>(UserData, {
    errorPolicy: "none",
    onCompleted: () => {
      updatePushToken();
    },
  });

  const user = data?.getUser;

  useEffect(() => {
    if (user) {
      if (unsubscribe === null) {
        unsubscribe = subscribeToMore({
          document: UserSubscription,
          updateQuery: (prev, { subscriptionData }) => {
            // @ts-expect-error apollo dumb
            const newFeedItem = subscriptionData.data.getUserUpdates;
            return Object.assign({}, prev, {
              getUser: newFeedItem,
            });
          },
        });
      }

      setUserContext(user);
    }
  }, [user]);

  useEffect(() => {
    const subscription =
      Notifications.addNotificationReceivedListener(handleNotification);
    return () => subscription.remove();
  }, []);

  if (loading) {
    return null;
  }

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
  return <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}/>;
}