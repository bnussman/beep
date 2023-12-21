import React, { useEffect, useMemo, useRef, useState } from "react";
import Constants from "expo-constants";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { BottomSheet } from "../../components/BottomSheet";
import { Logger } from "../../utils/Logger";
import { useUser } from "../../utils/useUser";
import { isAndroid, isMobile } from "../../utils/constants";
import { ApolloError, gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { cache, client } from "../../utils/Apollo";
import { LocationActivityType } from "expo-location";
import { Container } from "../../components/Container";
import { Alert } from "../../utils/Alert";
import { QueueItem } from "../../components/QueueItem";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import {
  Alert as NativeAlert,
  AppState,
  AppStateStatus,
  Pressable,
  RefreshControl,
} from "react-native";
import {
  GetInitialQueueQuery,
  GetQueueSubscription,
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
  FlatList as NativeFlatList,
  InfoIcon,
  Button,
} from "native-base";
import { Status } from "../../utils/types";
import { InProgressBeep } from "../../components/InProgressBeep";
import { Card } from "../../components/Card";
import { router, useNavigation } from "expo-router";

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
`;

const GetQueue = gql`
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

export default function StartBeepingScreen() {
  const { user } = useUser();
  const { colorMode } = useColorMode();
  const navigation = useNavigation();

  const [isBeeping, setIsBeeping] = useState(user?.isBeeping);
  const [singlesRate, setSinglesRate] = useState<string>(
    String(user?.singlesRate)
  );
  const [groupRate, setGroupRate] = useState<string>(String(user?.groupRate));
  const [capacity, setCapacity] = useState<string>(String(user?.capacity));

  const { data, refetch, loading } =
    useQuery<GetInitialQueueQuery>(GetInitialQueue, {
      notifyOnNetworkStatusChange: true,
      variables: { id: user?.id },
    });

  useSubscription<GetQueueSubscription>(GetQueue, {
    variables: { id: user?.id },
    onData({ data }) {
      cache.updateQuery<GetInitialQueueQuery>({ query: GetInitialQueue, variables: { id: user?.id } }, (prev) => {
        const newQueue = { getQueue: data.data!.getBeeperUpdates };
        if (prev && (prev.getQueue.length < newQueue.getQueue.length)) {
          bottomSheetRef.current?.expand();
        }
        return newQueue;
      });
    },
    skip: !user?.isBeeping
  });

  const [updateBeepSettings] =
    useMutation<UpdateBeepSettingsMutation>(UpdateBeepSettings);

  const queue = data?.getQueue;

  const bottomSheetRef = useRef<BottomSheetMethods>(null);

  const snapPoints = useMemo(() => ["15%", "85%", "100%"], []);

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

  const FlatList = isMobile ? BottomSheetFlatList : NativeFlatList;

  if (isBeeping && queue?.length === 0) {
    return (
      <Container center>
        <Stack space={2} p={4} alignItems="center" mb={12}>
          <Heading fontWeight="extrabold">Your queue is empty</Heading>
          <Text textAlign="center">
            If someone wants you to beep them, it will appear here. If your app
            is closed, you will recieve a push notification.
          </Text>
        </Stack>
        <Card>
          <Stack alignItems="center" space={2}>
            <Heading fontWeight="extrabold" fontSize="md">Want more riders?</Heading>
            <Text textAlign="center">
              Jump to the top of the beeper list
            </Text>
            <Button size="lg" _text={{ fontWeight: "extrabold" }} onPress={() => router.push("/(app)/premium")}>Get Promoted</Button>
          </Stack>
        </Card>
      </Container>
    );
  }

  if (!isBeeping || !queue) {
    return (
      <Container keyboard alignItems="center" height="100%">
        <Stack space={2} w="100%" p={4}>
          <FormControl>
            <FormControl.Label>Max Rider Capacity</FormControl.Label>
            <Input
              size="lg"
              placeholder="Max Capcity"
              keyboardType="numeric"
              value={String(capacity)}
              onChangeText={(value) => setCapacity(value)}
            />
            <FormControl.HelperText>
              Maximum number of riders you can safely fit in your car
            </FormControl.HelperText>
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
            <FormControl.HelperText>
              Price for a single person riding alone
            </FormControl.HelperText>
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
            <FormControl.HelperText>
              Price per person in a group
            </FormControl.HelperText>
          </FormControl>
        </Stack>
        <Spacer />
        <HStack alignItems="center" mb={10} space={2}>
          <InfoIcon />
          <Text fontSize="xs" color="gray.500">
            Use the toggle in the top right to start beeping
          </Text>
        </HStack>
      </Container>
    );
  }

  return (
    <Container alignItems="center">
      <Flex
        w="100%"
        height={queue.length > 1 ? "85%" : "100%"}
        p={3}
        pb={queue.length > 1 ? 4 : 16}
      >
        {queue[0] && <InProgressBeep beep={queue[0]} />}
      </Flex>
      {queue.length > 1 ? (
        <BottomSheet ref={bottomSheetRef} index={1} snapPoints={snapPoints}>
          <Pressable onPress={() => bottomSheetRef.current?.expand()}>
            <HStack alignItems="center" mb={2} pt={1} px={4}>
              <Heading fontWeight="extrabold" size="2xl">
                Queue
              </Heading>
              <Spacer />
              {queue.length > 0 &&
                queue.some((entry) => entry.status === Status.WAITING) && (
                  <Box rounded="full" bg="blue.400" w={4} h={4} mr={2} />
                )}
            </HStack>
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
        </BottomSheet>
      ) : null}
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
