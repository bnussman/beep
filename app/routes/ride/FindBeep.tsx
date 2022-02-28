import React, { useEffect, useState, useRef } from "react";
import Logger from "../../utils/Logger";
import LeaveButton from "./LeaveButton";
import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";
import * as SplashScreen from "expo-splash-screen";
import * as Location from "expo-location";
import { Share, Linking, AppState, AppStateStatus } from "react-native";
import { ApolloError, gql, useLazyQuery, useQuery } from "@apollo/client";
import { gqlChooseBeep } from "./helpers";
import { client } from "../../utils/Apollo";
import { RateCard } from "../../components/RateCard";
import { Tags } from "./Tags";
import { throttle } from "throttle-debounce";
import { Container } from "../../components/Container";
import { UserData } from "../../App";
import { Navigation } from "../../utils/Navigation";
import { EmailNotVerfiedCard } from "../../components/EmailNotVerifiedCard";
import {
  GetEtaQuery,
  GetInitialRiderStatusQuery,
  UserDataQuery,
} from "../../generated/graphql";
import {
  Button,
  Text,
  Input,
  Box,
  Heading,
  Stack,
  FormControl,
  Avatar,
  HStack,
  Center,
  VStack,
} from "native-base";
import LocationInput from "../../components/LocationInput";
import { Alert } from "../../utils/Alert";

const InitialRiderStatus = gql`
  query GetInitialRiderStatus {
    getRiderStatus {
      id
      position
      isAccepted
      origin
      destination
      state
      groupSize
      beeper {
        id
        first
        name
        singlesRate
        groupRate
        isStudent
        role
        venmo
        cashapp
        username
        phone
        photoUrl
        masksRequired
        capacity
        queueSize
        location {
          longitude
          latitude
        }
      }
    }
  }
`;

const RiderStatus = gql`
  subscription RiderStatus($id: String!) {
    getRiderUpdates(id: $id) {
      id
      position
      isAccepted
      origin
      destination
      state
      groupSize
      beeper {
        id
        first
        name
        singlesRate
        groupRate
        isStudent
        role
        venmo
        cashapp
        username
        phone
        photoUrl
        masksRequired
        capacity
        queueSize
        location {
          longitude
          latitude
        }
      }
    }
  }
`;

const BeepersLocation = gql`
  subscription BeepersLocation($id: String!) {
    getLocationUpdates(id: $id) {
      latitude
      longitude
    }
  }
`;

const GetETA = gql`
  query GetETA($start: String!, $end: String!) {
    getETA(start: $start, end: $end)
  }
`;

interface Props {
  navigation: Navigation;
}

let sub: any;
let riderStatusSub: any;

export function MainFindBeepScreen(props: Props): JSX.Element {
  const { data: userData } = useQuery<UserDataQuery>(UserData);

  const user = userData?.getUser;

  const { data, previousData, refetch } = useQuery<GetInitialRiderStatusQuery>(
    InitialRiderStatus,
    {
      notifyOnNetworkStatusChange: true,
    }
  );
  const [getETA, { data: eta, loading: etaLoading, error: etaError }] =
    useLazyQuery<GetEtaQuery>(GetETA);

  const [groupSize, setGroupSize] = useState<string>("");
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [isGetBeepLoading, setIsGetBeepLoading] = useState<boolean>(false);

  const originRef = useRef<any>();
  const destinationRef = useRef<any>();

  const beep = data?.getRiderStatus;

  const appState = useRef(AppState.currentState);

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
  };

  async function updateETA(lat: number, long: number): Promise<void> {
    let lastKnowLocation = await Location.getLastKnownPositionAsync({
      maxAge: 180000,
      requiredAccuracy: 800,
    });

    if (!lastKnowLocation) {
      lastKnowLocation = await Location.getCurrentPositionAsync();
    }

    getETA({
      variables: {
        start: `${lat},${long}`,
        end: `${lastKnowLocation.coords.latitude},${lastKnowLocation.coords.longitude}`,
      },
    });
  }

  async function subscribeToLocation() {
    const a = client.subscribe({
      query: BeepersLocation,
      variables: { id: data?.getRiderStatus?.beeper.id },
    });

    sub = a.subscribe(({ data }) => {
      throttleUpdateETA(
        data.getLocationUpdates.latitude,
        data.getLocationUpdates.longitude
      );
    });
  }

  const throttleUpdateETA = throttle(10000, updateETA);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (user?.id && beep) {
      subscribeToRiderStatus();
    }
  }, [user, beep]);

  function subscribeToRiderStatus(): void {
    const a = client.subscribe({
      query: RiderStatus,
      variables: { id: user?.id },
    });

    riderStatusSub = a.subscribe(({ data }) => {
      client.writeQuery({
        query: InitialRiderStatus,
        data: { getRiderStatus: data.getRiderUpdates },
      });
    });
  }

  useEffect(() => {
    if (
      (beep?.state == 1 && previousData?.getRiderStatus?.state == 0) ||
      (beep?.state == 1 && !previousData)
    ) {
      subscribeToLocation();
    }
    if (beep?.state == 2 && previousData?.getRiderStatus?.state == 1) {
      sub?.unsubscribe();
    }
    if (beep?.beeper.location && beep?.state === 1) {
      updateETA(beep.beeper.location.latitude, beep.beeper.location.longitude);
    }
    if (previousData && !beep) {
      riderStatusSub?.unsubscribe();
    }
  }, [data]);

  async function findBeep(): Promise<void> {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      return alert("You must enable location to find a ride.");
    }

    let lastKnowLocation = await Location.getLastKnownPositionAsync({
      maxAge: 180000,
      requiredAccuracy: 800,
    });

    if (!lastKnowLocation) {
      lastKnowLocation = await Location.getCurrentPositionAsync();
    }

    return props.navigation.navigate("Pick Beeper", {
      latitude: lastKnowLocation.coords.latitude,
      longitude: lastKnowLocation.coords.longitude,
      handlePick: (id: string) => chooseBeep(id),
    });
  }

  async function chooseBeep(id: string): Promise<void> {
    setIsGetBeepLoading(true);
    try {
      const data = await gqlChooseBeep({
        beeperId: id,
        origin: origin,
        destination: destination,
        groupSize: Number(groupSize),
      });

      client.writeQuery({
        query: InitialRiderStatus,
        data: { getRiderStatus: { ...data.data.chooseBeep } },
      });

      subscribeToRiderStatus();
    } catch (error) {
      Alert(error as ApolloError);
    }
    setIsGetBeepLoading(false);
  }

  function getVenmoLink(): string {
    if (!beep?.beeper.venmo) return "";

    if (Number(beep.groupSize) > 1) {
      return `venmo://paycharge?txn=pay&recipients=${
        beep.beeper.venmo
      }&amount=${beep.beeper.groupRate * beep.groupSize}&note=Beep`;
    }
    return `venmo://paycharge?txn=pay&recipients=${beep.beeper.venmo}&amount=${beep.beeper?.singlesRate}&note=Beep`;
  }

  function getCashAppLink(): string {
    if (!beep?.beeper.cashapp) return "";

    if (Number(beep.groupSize) > 1) {
      return `https://cash.app/$${beep.beeper.cashapp}/${
        beep.groupSize * beep.beeper.groupRate
      }`;
    }
    return `https://cash.app/$${beep.beeper.cashapp}/${beep.beeper.singlesRate}`;
  }

  function shareVenmoInformation(): void {
    try {
      Share.share({
        message: `Please Venmo ${beep?.beeper.venmo} $${beep?.beeper.groupRate} for the beep!`,
        url: getVenmoLink(),
      });
    } catch (error) {
      Logger.error(error);
    }
  }

  function getCurrentStatusMessage(): string {
    switch (beep?.state) {
      case 0:
        return "Beeper is getting ready to come get you.";
      case 1:
        return "Beeper is on their way to get you.";
      case 2:
        return "Beeper is here to pick you up!";
      case 3:
        return "You are currenly in the car with your beeper.";
      default:
        return "Unknown";
    }
  }

  if (user?.isBeeping) {
    return (
      <Container justifyContent="center" alignItems="center">
        <Heading>You are beeping!</Heading>
        <Text>You can&apos;t find a ride when you are beeping</Text>
      </Container>
    );
  }

  if (!beep) {
    return (
      <Container keyboard alignItems="center" pt={2}>
        <Stack space={4} w="90%">
          <RateCard navigation={props.navigation} />
          {!user?.isEmailVerified ? <EmailNotVerfiedCard /> : null}
          <FormControl>
            <FormControl.Label>Group Size</FormControl.Label>
            <Input
              size="lg"
              w="100%"
              keyboardType="number-pad"
              value={groupSize}
              onChangeText={(value) => setGroupSize(value)}
              onSubmitEditing={() => originRef.current.focus()}
              returnKeyType="next"
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Pick Up Location</FormControl.Label>
            <LocationInput
              size="lg"
              ref={originRef}
              value={origin}
              onChangeText={(value) => setOrigin(value)}
              onSubmitEditing={() => destinationRef.current.focus()}
              returnKeyType="next"
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Destination Location</FormControl.Label>
            <Input
              size="lg"
              ref={destinationRef}
              value={destination}
              onChangeText={(value) => setDestination(value)}
              returnKeyType="go"
            />
          </FormControl>
          <Button
            h={50}
            size="lg"
            onPress={() => findBeep()}
            isLoading={isGetBeepLoading}
            isDisabled={
              origin === "Loading your location..." ||
              !origin ||
              !groupSize ||
              !destination
            }
          >
            Find a Beep
          </Button>
        </Stack>
      </Container>
    );
  }

  if (beep.isAccepted) {
    return (
      <Container pt={2}>
        <Center>
          <Avatar
            size={100}
            source={{
              uri: beep.beeper.photoUrl ? beep.beeper.photoUrl : undefined,
            }}
          />
          <Heading>{beep.beeper.name}</Heading>
          <Text>is your beeper!</Text>
          <Tags user={beep.beeper} />
          {beep.position <= 0 && (
            <Box
              _light={{ bg: "coolGray.50" }}
              _dark={{ bg: "gray.700" }}
              rounded="lg"
              p={4}
              mt={2}
              mb={4}
            >
              <Heading size="md" fontWeight="extrabold">
                Current Status
              </Heading>
              <Text>{getCurrentStatusMessage()}</Text>
              {beep.state === 1 ? (
                <>
                  {etaError ? <Text mt={2}>{etaError.message}</Text> : null}
                  {eta?.getETA && beep.beeper.location ? (
                    <Text bold mt={2}>
                      Your beeper is {eta.getETA} away
                    </Text>
                  ) : null}
                </>
              ) : null}
            </Box>
          )}
          {beep.position > 0 ? (
            <>
              <Text>{beep.position}</Text>
              <Text>
                {beep.position === 1 ? "person is" : "people are"} ahead of you
                in {beep.beeper.first || "User"}&apos;s queue.
              </Text>
            </>
          ) : null}
          <VStack space={2} w="90%">
            <Button
              colorScheme="green"
              onPress={() => Linking.openURL(`tel:${beep.beeper.phone}`)}
              endIcon={
                <MaterialCommunityIcons name="phone" color="white" size={22} />
              }
            >
              Call Beeper
            </Button>
            <Button
              colorScheme="green"
              onPress={() => Linking.openURL(`sms:${beep.beeper.phone}`)}
              endIcon={
                <MaterialCommunityIcons
                  name="message-text"
                  color="white"
                  size={22}
                />
              }
            >
              Text Beeper
            </Button>
            {beep.beeper.venmo ? (
              <Button
                colorScheme="blue"
                variant="subtle"
                onPress={() => Linking.openURL(getVenmoLink())}
              >
                Pay Beeper with Venmo
              </Button>
            ) : null}
            {beep.beeper.cashapp ? (
              <Button onPress={() => Linking.openURL(getCashAppLink())}>
                Pay Beeper with Cash App
              </Button>
            ) : null}
            {Number(beep.groupSize) > 1 ? (
              <Button
                colorScheme="blue"
                onPress={() => shareVenmoInformation()}
              >
                Share Venmo Info with Your Friends
              </Button>
            ) : null}
            {beep.position >= 1 ? (
              <LeaveButton beepersId={beep.beeper.id} />
            ) : null}
          </VStack>
        </Center>
      </Container>
    );
  } else {
    return (
      <Container alignItems="center" pt={2}>
        <Stack space={4} w="90%" alignItems="center">
          <Avatar
            size={100}
            source={{
              uri: beep.beeper.photoUrl ? beep.beeper.photoUrl : undefined,
            }}
          />
          <Box alignItems="center">
            <Text>Waiting on</Text>
            <Heading>{beep.beeper.name}</Heading>
            <Text>to accept your request.</Text>
          </Box>
          <Tags user={beep.beeper} />
          <Box alignItems="center">
            <Text>
              {beep.beeper.first}
              {"'"}
              {beep.beeper.first.charAt(beep.beeper.first.length - 1) != "s"
                ? "s"
                : ""}{" "}
              Rates
            </Text>
            <Text fontWeight="thin">per person</Text>
          </Box>
          <HStack space={4}>
            <Box alignItems="center">
              <Text fontWeight="extrabold">Single</Text>
              <Text>${beep.beeper.singlesRate}</Text>
            </Box>
            <Box alignItems="center">
              <Text fontWeight="extrabold">Group</Text>
              <Text>${beep.beeper.groupRate}</Text>
            </Box>
          </HStack>
          <Box alignItems="center">
            <Heading fontWeight="extrabold">{beep.beeper.queueSize}</Heading>
            <Text>
              {beep.beeper.queueSize === 1 ? "person is" : "people are"} ahead
              of you in {beep.beeper.first}
              {"'"}s queue
            </Text>
          </Box>
          <LeaveButton beepersId={beep.beeper.id} />
        </Stack>
      </Container>
    );
  }
}
