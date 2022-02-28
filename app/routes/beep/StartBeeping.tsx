import React, { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import ActionButton from "../../components/ActionButton";
import AcceptDenyButton from "../../components/AcceptDenyButton";
import Logger from "../../utils/Logger";
import { isAndroid } from "../../utils/config";
import { gql, useMutation, useQuery } from "@apollo/client";
import { client } from "../../utils/Apollo";
import { Navigation } from "../../utils/Navigation";
import { Tag } from "../ride/Tags";
import { LocationActivityType } from "expo-location";
import { Container } from "../../components/Container";
import { UserData } from "../../App";
import {
  GetInitialQueueQuery,
  UpdateBeepSettingsMutation,
  UserDataQuery,
} from "../../generated/graphql";
import {
  Linking,
  Platform,
  Alert,
  AppState,
  AppStateStatus,
  Pressable,
} from "react-native";
import {
  Avatar,
  Input,
  Switch,
  Text,
  Checkbox,
  Button,
  Heading,
  FormControl,
  Stack,
  Flex,
  VStack,
  HStack,
  Box,
  FlatList,
  Divider,
} from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Props {
  navigation: Navigation;
}

let unsubscribe: any = null;

const LocationUpdate = gql`
  mutation LocationUpdate(
    $latitude: Float!
    $longitude: Float!
    $altitude: Float!
    $accuracy: Float
    $altitideAccuracy: Float
    $heading: Float!
    $speed: Float!
  ) {
    setLocation(
      location: {
        latitude: $latitude
        longitude: $longitude
        altitude: $altitude
        accuracy: $accuracy
        altitideAccuracy: $altitideAccuracy
        heading: $heading
        speed: $speed
      }
    )
  }
`;

const GetInitialQueue = gql`
  query GetInitialQueue {
    getQueue {
      id
      isAccepted
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
        photoUrl
        isStudent
      }
    }
  }
`;

const GetQueue = gql`
  subscription GetQueue($id: String!) {
    getBeeperUpdates(id: $id) {
      id
      isAccepted
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
        photoUrl
        isStudent
      }
    }
  }
`;

const UpdateBeepSettings = gql`
  mutation UpdateBeepSettings(
    $singlesRate: Float!
    $groupRate: Float!
    $capacity: Float!
    $isBeeping: Boolean!
    $masksRequired: Boolean!
  ) {
    setBeeperStatus(
      input: {
        singlesRate: $singlesRate
        groupRate: $groupRate
        capacity: $capacity
        isBeeping: $isBeeping
        masksRequired: $masksRequired
      }
    )
  }
`;

export const LOCATION_TRACKING = "location-tracking";

export function StartBeepingScreen(props: Props): JSX.Element {
  const { data: userData } = useQuery<UserDataQuery>(UserData);

  const user = userData?.getUser;

  const [isBeeping, setIsBeeping] = useState(user?.isBeeping);
  const [masksRequired, setMasksRequired] = useState(user?.masksRequired);
  const [singlesRate, setSinglesRate] = useState<string>(
    String(user?.singlesRate)
  );
  const [groupRate, setGroupRate] = useState<string>(String(user?.groupRate));
  const [capacity, setCapacity] = useState<string>(String(user?.capacity));

  const { subscribeToMore, data, refetch } = useQuery<GetInitialQueueQuery>(
    GetInitialQueue,
    { notifyOnNetworkStatusChange: true }
  );

  const [updateBeepSettings] =
    useMutation<UpdateBeepSettingsMutation>(UpdateBeepSettings);

  const queue = data?.getQueue;

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      refetch();
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  };

  function toggleSwitchWrapper(): void {
    if (isAndroid && !isBeeping) {
      Alert.alert(
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
    props.navigation.setOptions({
      // eslint-disable-next-line react/display-name
      headerRight: () => (
        <Switch
          mr={3}
          isChecked={isBeeping}
          onToggle={() => toggleSwitchWrapper()}
        />
      ),
    });
  }, [
    props.navigation,
    isBeeping,
    capacity,
    singlesRate,
    groupRate,
    masksRequired,
  ]);

  async function getBeepingLocationPermissions(): Promise<boolean> {
    //Temporary fix for being able to toggle beeping in dev
    if (__DEV__) return true;

    const { status: fgStatus } =
      await Location.requestForegroundPermissionsAsync();
    const { status: bgStatus } =
      await Location.requestBackgroundPermissionsAsync();

    if (fgStatus !== "granted" || bgStatus !== "granted") {
      return false;
    }

    return true;
  }

  async function toggleSwitch(): Promise<void> {
    const willBeBeeping = !isBeeping;
    setIsBeeping((value) => !value);

    if (willBeBeeping) {
      if (!(await getBeepingLocationPermissions())) {
        setIsBeeping((value) => !value);
        alert("You must allow background location to start beeping!");
        return;
      }
      startLocationTracking();
    } else {
      stopLocationTracking();
    }

    try {
      await updateBeepSettings({
        variables: {
          isBeeping: willBeBeeping,
          singlesRate: Number(singlesRate),
          groupRate: Number(groupRate),
          masksRequired: masksRequired,
          capacity: Number(capacity),
        },
      });

      if (willBeBeeping) {
        sub();
      } else {
        if (unsubscribe) unsubscribe();
      }
    } catch (error) {
      setIsBeeping((value) => !value);
      alert(error.message);
    }
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
        return Object.assign({}, prev, {
          getQueue: newQueue,
        });
      },
    });
  }

  function handleDirections(origin: string, dest: string): void {
    if (Platform.OS == "ios") {
      Linking.openURL(`http://maps.apple.com/?saddr=${origin}&daddr=${dest}`);
    } else {
      Linking.openURL(`https://www.google.com/maps/dir/${origin}/${dest}/`);
    }
  }

  function handleVenmo(groupSize: string | number, venmo: string): void {
    if (Number(groupSize) > 1) {
      Linking.openURL(
        `venmo://paycharge?txn=pay&recipients=${venmo}&amount=${
          (user?.groupRate || 0) * Number(groupSize)
        }&note=Beep`
      );
    } else {
      Linking.openURL(
        `venmo://paycharge?txn=pay&recipients=${venmo}&amount=${user?.singlesRate}&note=Beep`
      );
    }
  }

  function handleCashApp(groupSize: string | number, cashapp: string): void {
    if (Number(groupSize) > 1) {
      Linking.openURL(
        `https://cash.app/$${cashapp}/${
          Number(groupSize) * (user?.groupRate || 0)
        }`
      );
    } else {
      Linking.openURL(`https://cash.app/$${cashapp}/${user?.singlesRate || 0}`);
    }
  }

  if (!isBeeping) {
    return (
      <Container keyboard alignItems="center">
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
          <Checkbox
            isChecked={masksRequired}
            onChange={(value: boolean) => setMasksRequired(value)}
            value="Masks?"
          >
            Require riders to have a mask
          </Checkbox>
        </Stack>
      </Container>
    );
  } else {
    if (queue && queue?.length > 0) {
      return (
        <Container alignItems="center">
          <FlatList
            w="96%"
            data={data?.getQueue}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={Divider}
            renderItem={({ item, index }) =>
              item.isAccepted ? (
                <>
                  <Flex
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box>
                      <Pressable
                        onPress={() =>
                          props.navigation.navigate("Profile", {
                            id: item.rider.id,
                            beep: item.id,
                          })
                        }
                      >
                        <Flex direction="row" alignItems="center">
                          <Avatar
                            size={50}
                            mr={2}
                            source={{
                              uri: item.rider.photoUrl
                                ? item.rider.photoUrl
                                : undefined,
                            }}
                          />
                          <Text bold fontSize="xl">
                            {item.rider.name}
                          </Text>
                        </Flex>
                      </Pressable>
                      <Flex direction="row" alignItems="center">
                        <Text bold mr={2}>
                          Group Size
                        </Text>
                        <Text>{item.groupSize}</Text>
                      </Flex>
                      <Flex direction="row" alignItems="center">
                        <Text bold mr={2}>
                          Pick Up
                        </Text>
                        <Text>{item.origin}</Text>
                      </Flex>
                      <Flex direction="row" alignItems="center">
                        <Text bold mr={2}>
                          Drop Off
                        </Text>
                        <Text>{item.destination}</Text>
                      </Flex>
                    </Box>
                    <HStack space={2}>
                      <Button
                        onPress={() => {
                          Linking.openURL("tel:" + item.rider.phone);
                        }}
                        endIcon={
                          <MaterialCommunityIcons
                            name="phone"
                            color="white"
                            size={22}
                          />
                        }
                      />
                      <Button
                        onPress={() => {
                          Linking.openURL("sms:" + item.rider.phone);
                        }}
                        endIcon={
                          <MaterialCommunityIcons
                            name="message-text"
                            color="white"
                            size={22}
                          />
                        }
                      />
                    </HStack>
                  </Flex>
                  <VStack space={2}>
                    {item.rider?.venmo ? (
                      <Button
                        colorScheme="blue"
                        variant="subtle"
                        onPress={() =>
                          handleVenmo(item.groupSize, item.rider.venmo!)
                        }
                      >
                        Request Money from Rider with Venmo
                      </Button>
                    ) : null}
                    {item.rider?.cashapp ? (
                      <Button
                        colorScheme="green"
                        variant="subtle"
                        onPress={() =>
                          handleCashApp(item.groupSize, item.rider.cashapp!)
                        }
                      >
                        Request Money from Rider with Cash App
                      </Button>
                    ) : null}
                    {item.state <= 1 ? (
                      <Button
                        colorScheme="tertiary"
                        onPress={() =>
                          handleDirections("Current+Location", item.origin)
                        }
                        endIcon={
                          <MaterialCommunityIcons
                            name="map-legend"
                            color="white"
                            size={22}
                          />
                        }
                      >
                        Get Directions to Rider
                      </Button>
                    ) : (
                      <Button
                        onPress={() =>
                          handleDirections(item.origin, item.destination)
                        }
                        endIcon={
                          <MaterialCommunityIcons
                            name="map-legend"
                            color="white"
                            size={22}
                          />
                        }
                      >
                        Get Directions for Beep
                      </Button>
                    )}
                    <ActionButton item={item} index={index} />
                  </VStack>
                </>
              ) : (
                <Flex
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Pressable
                      onPress={() =>
                        props.navigation.navigate("Profile", {
                          id: item.rider.id,
                          beep: item.id,
                        })
                      }
                    >
                      <Flex direction="row" alignItems="center">
                        <Avatar
                          mr={2}
                          size={50}
                          source={{
                            uri: item.rider.photoUrl
                              ? item.rider.photoUrl
                              : undefined,
                          }}
                        />
                        <Heading size="md">{item.rider.name}</Heading>
                      </Flex>
                    </Pressable>
                    <Flex direction="row" alignItems="center">
                      <Text bold mr={2}>
                        Entered Queue
                      </Text>
                      <Text>
                        {new Date(item.start * 1000).toLocaleString("en-US", {
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}
                      </Text>
                    </Flex>
                    <Flex direction="row" alignItems="center">
                      <Text bold mr={2}>
                        Group Size
                      </Text>
                      <Text>{item.groupSize}</Text>
                    </Flex>
                    <Flex direction="row" alignItems="center">
                      <Text bold mr={2}>
                        Origin
                      </Text>
                      <Text>{item.origin}</Text>
                    </Flex>
                    <Flex direction="row" alignItems="center">
                      <Text bold mr={2}>
                        Destination
                      </Text>
                      <Text>{item.destination}</Text>
                    </Flex>
                  </Box>
                  {queue.filter(
                    (entry) => entry.start < item.start && !entry.isAccepted
                  ).length === 0 ? (
                    <HStack space={2}>
                      <AcceptDenyButton type="deny" item={item} />
                      <AcceptDenyButton type="accept" item={item} />
                    </HStack>
                  ) : null}
                </Flex>
              )
            }
          />
        </Container>
      );
    } else {
      return (
        <Container alignItems="center" justifyContent="center">
          <Stack space={2} w="90%" alignItems="center">
            <Heading>Your queue is empty</Heading>
            <Text>
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
    const { locations } = data;
    try {
      await client.mutate({
        mutation: LocationUpdate,
        variables: locations[0].coords,
      });
    } catch (e) {
      Logger.error(e);
    }
  }
});
