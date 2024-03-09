import React, { useEffect, useMemo, useState } from "react";
import Constants from "expo-constants";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import * as SplashScreen from "expo-splash-screen";
import { Logger } from "../../utils/Logger";
import { useUser } from "../../utils/useUser";
import { isAndroid } from "../../utils/constants";
import { ApolloError, useMutation, useQuery, useSubscription } from "@apollo/client";
import { cache, client } from "../../utils/Apollo";
import { LocationActivityType } from "expo-location";
import { Container } from "../../components/Container";
import { Alert } from "../../utils/Alert";
import { QueueItem } from "./QueueItem";
import { Beep } from "./Beep";
import { useNavigation } from "@react-navigation/native";
import { Status } from "../../utils/types";
import { graphql } from "gql.tada";
import {
  Alert as NativeAlert,
  AppState,
  AppStateStatus,
  Pressable,
  RefreshControl,
  useColorScheme,
  FlatList,
} from "react-native";
import {
  Input,
  Switch,
  Text,
  Heading,
  Stack,
  XStack,
  Button,
  Label,
  Circle,
  Sheet,
  Card,
} from "@beep/ui";

let unsubscribe: any = null;

const LocationUpdate = graphql(`
  mutation LocationUpdate($location: LocationInput!) {
    setLocation(location: $location) {
      id
      location {
        latitude
        longitude
      }
    }
  }
`);

export const GetInitialQueue = graphql(`
  query GetInitialQueue($id: String) {
    getQueue(id: $id) {
      id
      groupSize
      origin
      destination
      status
      rider {
        id
        name
        first
        last
        venmo
        cashapp
        phone
        photo
        rating
      }
    }
  }
`);

const GetQueue = graphql(`
  subscription GetQueue($id: String!) {
    getBeeperUpdates(id: $id) {
      id
      groupSize
      origin
      destination
      status
      rider {
        id
        name
        first
        last
        venmo
        cashapp
        phone
        photo
        rating
      }
    }
  }
`);

const UpdateBeepSettings = graphql(`
  mutation UpdateBeepSettings($input: BeeperSettingsInput!) {
    setBeeperStatus(input: $input) {
      id
      singlesRate
      groupRate
      capacity
      isBeeping
      queueSize
      location {
        latitude
        longitude
      }
    }
  }
`);

export const LOCATION_TRACKING = "location-tracking";

export function StartBeepingScreen() {
  const { user } = useUser();
  const colorMode = useColorScheme();
  const navigation = useNavigation();

  const [isBeeping, setIsBeeping] = useState(user?.isBeeping);
  const [singlesRate, setSinglesRate] = useState<string>(
    String(user?.singlesRate)
  );
  const [groupRate, setGroupRate] = useState<string>(String(user?.groupRate));
  const [capacity, setCapacity] = useState<string>(String(user?.capacity));

  const { data, refetch, loading } = useQuery(GetInitialQueue, {
    notifyOnNetworkStatusChange: true,
    variables: { id: user!.id },
  });

  useSubscription(GetQueue, {
    variables: { id: user!.id },
    onData({ data }) {
      cache.updateQuery({ query: GetInitialQueue, variables: { id: user?.id } }, (prev) => {
        const newQueue = { getQueue: data.data!.getBeeperUpdates };
        if (prev && (prev.getQueue.length < newQueue.getQueue.length)) {
          setPosition(100);
        }
        return newQueue;
      });
    },
    skip: !user?.isBeeping
  });

  const [position, setPosition] = useState(0);

  const [updateBeepSettings] = useMutation(UpdateBeepSettings);

  const queue = data?.getQueue;

  const snapPoints = useMemo(() => [100, 85, 15], []);

  useEffect(() => {
    const listener = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      listener.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === "active") {
      refetch();
    }
  };

  function toggleSwitchWrapper(): void {
    if (isAndroid && !isBeeping) {
      NativeAlert.alert(
        "Background Location Notice",
        "Ride Beep App collects location data to enable ETAs for riders when your are beeping and the app is closed or not in use",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          { text: "OK", onPress: () => toggleSwitch() },
        ],
        { cancelable: true }
      );
    } else {
      toggleSwitch();
    }
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Stack mr="$2">
          <Switch
            checked={isBeeping}
            native
            onCheckedChange={() => toggleSwitchWrapper()}
          >
            <Switch.Thumb />
          </Switch>
        </Stack>
      ),
    });
  }, [navigation, isBeeping, capacity, singlesRate, groupRate]);

  async function getBeepingLocationPermissions(): Promise<boolean> {
    try {
      //Temporary fix for being able to toggle beeping in dev
      if (__DEV__ || Constants.appOwnership === "expo") return true;

      const { status: fgStatus } =
        await Location.requestForegroundPermissionsAsync();
      const { status: bgStatus } =
        await Location.requestBackgroundPermissionsAsync();

      if (fgStatus !== "granted" || bgStatus !== "granted") {
        return false;
      }

      return true;
    } catch (error) {
      Logger.error(error);
      return false;
    }
  }

  async function toggleSwitch(): Promise<void> {
    const willBeBeeping = !isBeeping;

    setIsBeeping((value) => !value);

    const hasLoactionPermission = await getBeepingLocationPermissions();

    if (willBeBeeping && !hasLoactionPermission) {
      setIsBeeping((value) => !value);
      alert("You must allow background location to start beeping!");
      return;
    }

    let lon = undefined;
    let lat = undefined;

    if (willBeBeeping) {
      let lastKnowLocation = await Location.getLastKnownPositionAsync({
        maxAge: 180000,
        requiredAccuracy: 800,
      });

      if (!lastKnowLocation) {
        lastKnowLocation = await Location.getCurrentPositionAsync();
      }

      lon = lastKnowLocation.coords.longitude;
      lat = lastKnowLocation.coords.latitude;
    }

    updateBeepSettings({
      variables: {
        input: {
          isBeeping: willBeBeeping,
          singlesRate: Number(singlesRate),
          groupRate: Number(groupRate),
          capacity: Number(capacity),
          latitude: lat,
          longitude: lon,
        },
      },
    })
      .then(() => {
        if (willBeBeeping) {
          startLocationTracking();
        } else {
          if (unsubscribe) unsubscribe();
          stopLocationTracking();
        }
      })
      .catch((error: ApolloError) => {
        setIsBeeping((value) => !value);
        Alert(error);
      });
  }

  async function startLocationTracking(): Promise<void> {
    if (!__DEV__) {
      await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
        accuracy: Location.Accuracy.Highest,
        timeInterval: 15 * 1000,
        distanceInterval: 6,
        activityType: LocationActivityType.AutomotiveNavigation,
        showsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: "Ride Beep App",
          notificationBody: "You are currently beeping!",
          notificationColor: "#e8c848",
        },
      });

      const hasStarted = await Location.hasStartedLocationUpdatesAsync(
        LOCATION_TRACKING
      );

      if (!hasStarted)
        Logger.error("User was unable to start location tracking");
    }
  }

  async function stopLocationTracking(): Promise<void> {
    if (!__DEV__) {
      Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
    }
  }

  useEffect(() => {
    const init = async () => {
      if (user?.isBeeping) {
        if (!(await getBeepingLocationPermissions())) {
          alert("You must allow background location to start beeping!");
          return;
        }
        startLocationTracking();
      }
    };

    init();
  }, []);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    const handleIsBeepingChange = async () => {
      if (user.isBeeping && !isBeeping) {
        if (!(await getBeepingLocationPermissions())) {
          alert("You must allow background location to start beeping!");
          return;
        }
        startLocationTracking();
        setIsBeeping(true);
      }
      if (!user.isBeeping && isBeeping) {
        if (unsubscribe) unsubscribe();
        stopLocationTracking();
        setIsBeeping(false);
      }
    };

    handleIsBeepingChange();
  }, [user]);

  const isRefreshing = Boolean(data) && loading;

  if (isBeeping && queue?.length === 0) {
    return (
      <Container center>
        <Stack gap="$2" p="$4" alignItems="center" mb="$12">
          <Heading fontWeight="bold">Your queue is empty</Heading>
          <Text textAlign="center">
            If someone wants you to beep them, it will appear here. If your app
            is closed, you will recieve a push notification.
          </Text>
        </Stack>
        <Card p="$3">
          <Stack alignItems="center" gap="$2">
            <Heading fontWeight="bold">Want more riders?</Heading>
            <Text textAlign="center">
              Jump to the top of the beeper list
            </Text>
            <Button onPress={() => navigation.navigate("Main", { screen: "Premium" })}>Get Promoted</Button>
          </Stack>
        </Card>
      </Container>
    );
  }

  if (!isBeeping || !queue) {
    return (
      <Container keyboard alignItems="center" height="100%">
        <Stack gap="$2" w="100%" px="$4">
          <Stack>
            <Label htmlFor="capacity" fontWeight="bold">Max Rider Capacity</Label>
            <Input
              id="capacity"
              placeholder="Max Capcity"
              keyboardType="numeric"
              value={String(capacity)}
              onChangeText={(value) => setCapacity(value)}
            />
            <Text>
              Maximum number of riders you can safely fit in your car
            </Text>
          </Stack>
          <Stack>
            <Label htmlFor="singles" fontWeight="bold">Singles Rate</Label>
            <Input
              id="singles"
              placeholder="Singles Rate"
              keyboardType="numeric"
              value={String(singlesRate)}
              onChangeText={(value) => setSinglesRate(value)}
            />
            <Text>
              Price for a single person riding alone
            </Text>
          </Stack>
          <Stack>
            <Label htmlFor="groups" fontWeight="bold">Group Rate</Label>
            <Input
              id="groups"
              placeholder="Group Rate"
              keyboardType="numeric"
              value={String(groupRate)}
              onChangeText={(value) => setGroupRate(value)}
            />
            <Text>
              Price per person in a group
            </Text>
          </Stack>
        </Stack>
        <Stack flexGrow={1} />
        <Text fontSize="$3" mb="$8">
          Use the toggle in the top right to start beeping
        </Text>
      </Container>
    );
  }

  return (
    <Container alignItems="center">
      <Stack
        w="100%"
        height={queue.length > 1 ? "85%" : "95%"}
        p="$3"
      >
        {queue[0] && <Beep beep={queue[0]} />}
      </Stack>
      <Sheet snapPoints={snapPoints} position={position} onPositionChange={setPosition} snapPointsMode="percent" open={queue.length > 1}>
        <Sheet.Handle />
        <Sheet.Frame padding="$4">
          <Pressable onPress={() => setPosition(100)}>
            <XStack alignItems="center" mb={2} pt={1} px={4}>
              <Heading fontWeight="bold">
                Queue
              </Heading>
              <Stack flexGrow={1} />
              {queue.length > 0 &&
                queue.some((entry) => entry.status === Status.WAITING) && (
                  <Circle bg="$blue4" size="$4" />
                )}
            </XStack>
          </Pressable>
          <FlatList
            refreshing={loading && data?.getQueue !== undefined}
            onRefresh={refetch}
            data={queue.filter((entry) => entry.id !== queue[0]?.id)}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <QueueItem item={item} index={index} />
            )}
            contentContainerStyle={{ paddingLeft: 8, paddingRight: 8 }}
            refreshControl={
              <RefreshControl
                tintColor={colorMode === "dark" ? "#cfcfcf" : undefined}
                refreshing={isRefreshing}
                onRefresh={refetch}
              />
            }
          />
        </Sheet.Frame>
      </Sheet>
    </Container>
  );
}

TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
  if (error) {
    return Logger.error(error);
  }

  if (data) {
    // @ts-expect-error dumb
    const { locations } = data;
    try {
      await client.mutate({
        mutation: LocationUpdate,
        variables: { location: locations[0].coords },
      });
    } catch (e) {
      Logger.error(e);
    }
  }
});
