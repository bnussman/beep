import React, { useEffect, useMemo, useRef, useState } from "react";
import Constants from "expo-constants";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { BottomSheet } from "../../components/BottomSheet";
import { Logger } from "../../utils/Logger";
import { useUser } from "../../utils/useUser";
import { isAndroid } from "../../utils/constants";
import { ApolloError, gql, useMutation, useQuery } from "@apollo/client";
import { client } from "../../utils/Apollo";
import { Navigation } from "../../utils/Navigation";
import { LocationActivityType } from "expo-location";
import { Container } from "../../components/Container";
import { Alert } from "../../utils/Alert";
import { QueueItem } from "./QueueItem";
import { Beep } from "./Beep";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import {
  Alert as NativeAlert,
  AppState,
  AppStateStatus,
  RefreshControl,
} from "react-native";
import {
  GetInitialQueueQuery,
  UpdateBeepSettingsMutation,
} from "../../generated/graphql";
import {
  Input,
  Switch,
  Text,
  Heading,
  FormControl,
  Stack,
  Box,
  Spacer,
  HStack,
  useColorMode,
  Flex,
} from "native-base";

let unsubscribe: any = null;

const LocationUpdate = gql`
  mutation LocationUpdate($location: LocationInput!) {
    setLocation(location: $location) {
      id
      location {
        latitude
        longitude
      }
    }
  }
`;

const GetInitialQueue = gql`
  query GetInitialQueue {
    getQueue {
      id
      groupSize
      origin
      destination
      state
      start
      rider {
        id
        name
        first
        last
        venmo
        cashapp
        phone
        photo
        isStudent
        rating
      }
    }
  }
`;

const GetQueue = gql`
  subscription GetQueue($id: String!) {
    getBeeperUpdates(id: $id) {
      id
      groupSize
      origin
      destination
      state
      start
      rider {
        id
        name
        first
        last
        venmo
        cashapp
        phone
        photo
        isStudent
        rating
      }
    }
  }
`;

const UpdateBeepSettings = gql`
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
`;

export const LOCATION_TRACKING = "location-tracking";

export function StartBeepingScreen() {
  const { user } = useUser();
  const { colorMode } = useColorMode();
  const navigation = useNavigation<Navigation>();

  const [isBeeping, setIsBeeping] = useState(user?.isBeeping);
  const [singlesRate, setSinglesRate] = useState<string>(
    String(user?.singlesRate)
  );
  const [groupRate, setGroupRate] = useState<string>(String(user?.groupRate));
  const [capacity, setCapacity] = useState<string>(String(user?.capacity));

  const { subscribeToMore, data, refetch, loading } =
    useQuery<GetInitialQueueQuery>(GetInitialQueue, {
      notifyOnNetworkStatusChange: true,
    });

  const [updateBeepSettings] =
    useMutation<UpdateBeepSettingsMutation>(UpdateBeepSettings);

  const queue = data
    ? [...data.getQueue].sort((a, b) => a.start - b.start)
    : undefined;

  const bottomSheetRef = useRef<BottomSheetMethods>(null);

  const snapPoints = useMemo(() => ["20%", "85%", "100%"], []);

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
      // eslint-disable-next-line react/display-name
      headerRight: () => (
        <Switch
          mr={3}
          isChecked={isBeeping}
          onToggle={() => toggleSwitchWrapper()}
        />
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
          sub();
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
        sub();
      }
    };

    init();
  }, []);

  function sub(): void {
    unsubscribe = subscribeToMore({
      document: GetQueue,
      variables: {
        id: user?.id,
      },
      updateQuery: (prev, { subscriptionData }) => {
        // @ts-expect-error This works so I'm leaving it as is
        const newQueue = subscriptionData.data.getBeeperUpdates;
        if (prev.getQueue.length < newQueue.length) {
          bottomSheetRef.current?.expand();
        }
        return Object.assign({}, prev, {
          getQueue: newQueue,
        });
      },
    });
  }

  const isRefreshing = Boolean(data) && loading;

  if (!isBeeping) {
    return (
      <Container keyboard alignItems="center" height="100%">
        <Stack space={4} w="90%" mt={4}>
          <FormControl>
            <FormControl.Label>Max Rider Capacity</FormControl.Label>
            <Input
              size="lg"
              placeholder="Max Capcity"
              keyboardType="numeric"
              value={String(capacity)}
              onChangeText={(value) => setCapacity(value)}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Singles Rate</FormControl.Label>
            <Input
              size="lg"
              placeholder="Singles Rate"
              keyboardType="numeric"
              value={String(singlesRate)}
              onChangeText={(value) => setSinglesRate(value)}
              InputLeftElement={
                <Text pl={3} pr={1}>
                  $
                </Text>
              }
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Group Rate</FormControl.Label>
            <Input
              size="lg"
              placeholder="Group Rate"
              keyboardType="numeric"
              value={String(groupRate)}
              onChangeText={(value) => setGroupRate(value)}
              InputLeftElement={
                <Text pl={3} pr={1}>
                  $
                </Text>
              }
            />
          </FormControl>
        </Stack>
      </Container>
    );
  } else {
    if (queue && queue?.length > 0) {
      return (
        <Container alignItems="center">
          <Flex
            w="100%"
            height={queue.length > 1 ? "80%" : "100%"}
            px={4}
            py={4}
            pb={queue.length > 1 ? 4 : 16}
          >
            {queue[0] && <Beep beep={queue[0]} />}
          </Flex>
          {queue.length > 1 ? (
            <BottomSheet ref={bottomSheetRef} index={1} snapPoints={snapPoints}>
              <Box pt={1} px={4}>
                <HStack alignItems="center" mb={2}>
                  <Heading fontWeight="extrabold" size="2xl">
                    Queue
                  </Heading>
                  <Spacer />
                  {queue &&
                    queue.length > 0 &&
                    queue.some((entry) => entry.state === 0) && (
                      <Box rounded="full" bg="blue.400" w={4} h={4} mr={2} />
                    )}
                </HStack>
              </Box>
              <BottomSheetFlatList
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
            </BottomSheet>
          ) : null}
        </Container>
      );
    } else {
      return (
        <Container alignItems="center" justifyContent="center">
          <Stack space={2} w="90%" alignItems="center">
            <Heading fontWeight="extrabold">Your queue is empty</Heading>
            <Text textAlign="center">
              If someone wants you to beep them, it will appear here. If your
              app is closed, you will recieve a push notification.
            </Text>
          </Stack>
        </Container>
      );
    }
  }
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
