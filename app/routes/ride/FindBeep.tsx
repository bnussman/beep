import React, { useEffect, useState, useRef } from "react";
import LocationInput from "../../components/LocationInput";
import * as SplashScreen from "expo-splash-screen";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { GetRateData, RateSheet } from "../../components/RateSheet";
import { Logger } from "../../utils/Logger";
import { LeaveButton } from "./LeaveButton";
import { Ionicons } from "@expo/vector-icons";
import { Share, Linking, AppState, AppStateStatus } from "react-native";
import { ApolloError, gql, useLazyQuery, useQuery } from "@apollo/client";
import { gqlChooseBeep } from "./helpers";
import { client } from "../../utils/Apollo";
import { Container } from "../../components/Container";
import { Navigation } from "../../utils/Navigation";
import { EmailNotVerfiedCard } from "../../components/EmailNotVerifiedCard";
import { Alert } from "../../utils/Alert";
import { GradietnButton } from "../../components/GradientButton";
import { useUser } from "../../utils/useUser";
import { throttle } from "../../utils/throttle";
import { Subscription } from "../../utils/types";
import { Avatar } from "../../components/Avatar";
import { Rates } from "./Rates";
import { Card } from "../../components/Card";
import { PlaceInQueue } from "./PlaceInQueue";
import { GetBeepHistory } from "../Beeps";
import {
  GetEtaQuery,
  GetInitialRiderStatusQuery,
} from "../../generated/graphql";
import {
  Button,
  Text,
  Input,
  Heading,
  Stack,
  FormControl,
  HStack,
  Center,
  Icon,
  Spacer,
  Spinner,
  Pressable,
} from "native-base";
import MapView, { Marker } from "react-native-maps";

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

let sub: Subscription;
let riderStatusSub: Subscription;

export function MainFindBeepScreen() {
  const { user } = useUser();

  const { navigate } = useNavigation<Navigation>();

  const { data, previousData, refetch } = useQuery<GetInitialRiderStatusQuery>(
    InitialRiderStatus,
    {
      notifyOnNetworkStatusChange: true,
    }
  );

  const [getETA, { data: eta, error: etaError }] =
    useLazyQuery<GetEtaQuery>(GetETA);

  const [groupSize, setGroupSize] = useState<string>("");
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [isGetBeepLoading, setIsGetBeepLoading] = useState<boolean>(false);

  const [location, setLocation] = useState<Location.LocationObject>();

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

    setLocation(lastKnowLocation);

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

    sub = a.subscribe((values) => {
      throttleUpdateETA(
        values.data.getLocationUpdates.latitude,
        values.data.getLocationUpdates.longitude
      );

      const rideStatusData = { ...data };

      if (rideStatusData.getRiderStatus?.beeper.location) {
        rideStatusData.getRiderStatus.beeper.location.latitude =
          values.data.getLocationUpdates.latitude;
        rideStatusData.getRiderStatus.beeper.location.longitude =
          values.data.getLocationUpdates.longitude;

        client.writeQuery({
          query: InitialRiderStatus,
          data: { getRiderStatus: rideStatusData },
        });
      }
    });
  }

  const throttleUpdateETA = throttle(10000, updateETA);

  useEffect(() => {
    try {
      SplashScreen.hideAsync();
    } catch (error) {
      // ...
    }
  }, []);

  useEffect(() => {
    if (user?.id && beep && !riderStatusSub) {
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
      client.refetchQueries({ include: [GetRateData, GetBeepHistory] });
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

    setLocation(lastKnowLocation);

    return navigate("Choose Beeper", {
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
        <Heading fontWeight="extrabold">You are beeping!</Heading>
        <Text>You can&apos;t find a ride when you are beeping</Text>
      </Container>
    );
  }

  if (!beep) {
    return (
      <Container keyboard alignItems="center" pt={2} h="100%">
        <Stack space={4} w="90%">
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
              onChangeText={(value: string) => setOrigin(value)}
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
          <GradietnButton
            onPress={() => findBeep()}
            isLoading={isGetBeepLoading}
            isDisabled={
              origin === "Loading your location..." ||
              !origin ||
              !groupSize ||
              !destination
            }
          >
            Find Beep
          </GradietnButton>
        </Stack>
        <RateSheet />
      </Container>
    );
  }

  if (beep.isAccepted) {
    return (
      <Container p={2} px={4} alignItems="center">
        <Stack alignItems="center" space={4} w="100%" h="94%">
          <Pressable
            onPress={() =>
              navigate("Profile", { id: beep.beeper.id, beep: beep.id })
            }
          >
            <HStack alignItems="center" space={4} w="100%">
              <Stack flexShrink={1}>
                <Heading
                  size="xl"
                  fontWeight="extrabold"
                  letterSpacing="sm"
                  isTruncated
                >
                  {beep.beeper.name}
                </Heading>
                <Text isTruncated fontSize="xs">
                  <Text fontWeight="extrabold">Pick Up </Text>
                  <Text>{beep.origin}</Text>
                </Text>
                <Text isTruncated fontSize="xs">
                  <Text fontWeight="extrabold">Destination </Text>
                  <Text>{beep.destination}</Text>
                </Text>
              </Stack>
              <Spacer />
              <Avatar size="xl" url={beep.beeper.photoUrl} />
            </HStack>
          </Pressable>
          <Rates
            singles={beep.beeper.singlesRate}
            group={beep.beeper.groupRate}
          />
          {beep.position <= 0 && (
            <Stack w="100%" space={4}>
              <Card w="100%">
                <Heading
                  size="md"
                  letterSpacing="sm"
                  fontWeight="extrabold"
                  mb={1}
                >
                  Current Status
                </Heading>
                <Text>{getCurrentStatusMessage()}</Text>
                {/* <StatusBar state={beep.state} /> */}
              </Card>
              <MapView
                style={{ width: "100%", height: 200, borderRadius: 15 }}
                initialRegion={{
                  latitude: beep.beeper.location?.latitude ?? 0,
                  longitude: beep.beeper.location?.longitude ?? 0,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: beep.beeper.location?.latitude ?? 0,
                    longitude: beep.beeper.location?.longitude ?? 0,
                  }}
                  title={beep.beeper.name}
                >
                  <Text fontSize="3xl">🚕</Text>
                </Marker>
                {location && (
                  <Marker
                    coordinate={{
                      latitude: location.coords.latitude,
                      longitude: location.coords.longitude,
                    }}
                    title="You"
                  />
                )}
              </MapView>
            </Stack>
          )}
          {beep.state === 1 && (
            <Card w="100%">
              <HStack>
                <Heading fontWeight="extrabold" size="sm">
                  ETA
                </Heading>
                <Spacer />
                {etaError ? (
                  <Text>{etaError.message}</Text>
                ) : eta?.getETA ? (
                  <Text>{eta.getETA}</Text>
                ) : (
                  <Spinner size="sm" />
                )}
              </HStack>
            </Card>
          )}
          {beep.position > 0 && (
            <PlaceInQueue
              firstName={beep.beeper.first}
              position={beep.position}
            />
          )}
          <Spacer />
          <Stack space={2} w="100%">
            <HStack space={2} w="100%">
              <Button
                flexGrow={1}
                onPress={() => Linking.openURL(`tel:${beep.beeper.phone}`)}
                endIcon={
                  <Icon as={Ionicons} name="ios-call" color="white" size="md" />
                }
              >
                Call Beeper
              </Button>
              <Button
                flexGrow={1}
                onPress={() => Linking.openURL(`sms:${beep.beeper.phone}`)}
                endIcon={
                  <Icon
                    as={Ionicons}
                    name="ios-chatbox"
                    color="white"
                    size="md"
                  />
                }
              >
                Text Beeper
              </Button>
            </HStack>
            <HStack w="100%" space={2}>
              {beep.beeper.venmo ? (
                <Button
                  colorScheme="lightBlue"
                  flexGrow={1}
                  rightIcon={
                    <Icon as={Ionicons} size="md" name="ios-card-outline" />
                  }
                  onPress={() => Linking.openURL(getVenmoLink())}
                >
                  Pay with Venmo
                </Button>
              ) : null}
              {Number(beep.groupSize) > 1 ? (
                <Button
                  flexShrink={1}
                  rightIcon={
                    <Icon as={Ionicons} name="ios-share-outline" size="md" />
                  }
                  onPress={() => shareVenmoInformation()}
                >
                  Share Venmo
                </Button>
              ) : null}
            </HStack>
            {beep.beeper.cashapp ? (
              <Button onPress={() => Linking.openURL(getCashAppLink())}>
                Pay Beeper with Cash App
              </Button>
            ) : null}
            {beep.position >= 1 ? (
              <LeaveButton beepersId={beep.beeper.id} />
            ) : null}
          </Stack>
        </Stack>
      </Container>
    );
  } else {
    return (
      <Container alignItems="center" pt={2}>
        <Stack space={4} w="90%" alignItems="center" h="94%">
          <Avatar size={100} url={beep.beeper.photoUrl} />
          <Center>
            <Text>Waiting on</Text>
            <Heading letterSpacing="xs" fontWeight="extrabold">
              {beep.beeper.name}
            </Heading>
            <Text>to accept your request.</Text>
          </Center>
          <Card w="100%">
            <Text isTruncated fontSize="xs">
              <Text fontWeight="extrabold">Pick Up </Text>
              <Text>{beep.origin}</Text>
            </Text>
            <Text isTruncated fontSize="xs">
              <Text fontWeight="extrabold">Destination </Text>
              <Text>{beep.destination}</Text>
            </Text>
            <Text isTruncated fontSize="xs">
              <Text fontWeight="extrabold">Number of Riders </Text>
              <Text>{beep.groupSize}</Text>
            </Text>
          </Card>
          <Rates
            singles={beep.beeper.singlesRate}
            group={beep.beeper.groupRate}
          />
          <PlaceInQueue
            firstName={beep.beeper.first}
            position={beep.position}
          />
          <Spacer />
          <LeaveButton beepersId={beep.beeper.id} w="100%" size="lg" />
        </Stack>
      </Container>
    );
  }
}
