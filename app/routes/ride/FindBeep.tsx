import React, { useEffect } from "react";
import LocationInput from "../../components/LocationInput";
import * as SplashScreen from "expo-splash-screen";
import { Controller, useForm } from "react-hook-form";
import { BeeperMarker, BeepersMap } from "./BeepersMap";
import { useLocation } from "../../utils/useLocation";
import { Map } from "../../components/Map";
import { useNavigation } from "@react-navigation/native";
import { GetRateData, RateSheet } from "../../components/RateSheet";
import { LeaveButton } from "./LeaveButton";
import { Ionicons } from "@expo/vector-icons";
import { Linking, AppState, AppStateStatus } from "react-native";
import { cache, client } from "../../utils/Apollo";
import { Container } from "../../components/Container";
import { useUser } from "../../utils/useUser";
import { throttle } from "../../utils/throttle";
import { Status } from "../../utils/types";
import { Avatar } from "../../components/Avatar";
import { Rates } from "./Rates";
import { Card } from "../../components/Card";
import { PlaceInQueue } from "./PlaceInQueue";
import { GetBeepHistory } from "../Beeps";
import {
  getRawPhoneNumber,
  openCashApp,
  openVenmo,
  shareVenmoInformation,
} from "../../utils/links";
import {
  ApolloError,
  useLazyQuery,
  useMutation,
  useQuery,
  useSubscription,
} from "@apollo/client";
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
  WarningOutlineIcon,
  Image,
} from "native-base";
import { VariablesOf, graphql } from "gql.tada";
import { ChooseBeep } from '../ride/PickBeep';

export const InitialRiderStatus = graphql(`
  query GetInitialRiderStatus {
    getRiderStatus {
      id
      position
      origin
      destination
      status
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
        photo
        capacity
        queueSize
        location {
          longitude
          latitude
        }
        cars {
          id
          photo
          make
          color
          model
        }
      }
    }
  }
`);

const RiderStatus = graphql(`
  subscription RiderStatus {
    getRiderUpdates {
      id
      position
      origin
      destination
      status
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
        photo
        capacity
        queueSize
        location {
          longitude
          latitude
        }
        cars {
          id
          photo
          make
          color
          model
        }
      }
    }
  }
`);

const BeepersLocation = graphql(`
  subscription BeepersLocation($id: String!) {
    getLocationUpdates(id: $id) {
      latitude
      longitude
    }
  }
`);

const GetETA = graphql(`
  query GetETA($start: String!, $end: String!) {
    getETA(start: $start, end: $end)
  }
`);

export function MainFindBeepScreen() {
  const { user } = useUser();
  const { getLocation } = useLocation(false);
  const { navigate } = useNavigation();

  const { data, previousData, refetch } = useQuery(
    InitialRiderStatus,
    {
      notifyOnNetworkStatusChange: true,
    }
  );

  const beep = data?.getRiderStatus;

  const isAcceptedBeep = [
    Status.ACCEPTED,
    Status.IN_PROGRESS,
    Status.HERE,
    Status.ON_THE_WAY,
  ].includes(beep?.status as Status);

  useSubscription(RiderStatus, {
    onData({ data }) {
      client.writeQuery({
        query: InitialRiderStatus,
        data: { getRiderStatus: data.data?.getRiderUpdates },
      });
    },
    skip: !beep,
  });

  useSubscription(BeepersLocation, {
    variables: { id: beep!.beeper.id },
    onData({ data }) {
      if (!data?.data?.getLocationUpdates?.latitude) return;

      cache.modify({
        id: cache.identify({
          __typename: "User",
          id: beep?.beeper.id,
        }),
        fields: {
          location() {
            return {
              latitude: data.data?.getLocationUpdates?.latitude,
              longitude: data.data?.getLocationUpdates?.longitude,
            };
          },
        },
      });
    },
    skip: !isAcceptedBeep,
  });

  const [getETA, { data: eta, error: etaError }] = useLazyQuery(GetETA);

  const {
    control,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<Omit<VariablesOf<typeof ChooseBeep>, 'beeperId'>>({
    defaultValues: {
      groupSize: undefined,
      origin: '',
      destination: '',
    },
  });

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === "active") {
      refetch();
    }
  };

  const updateETA = throttle(25000, async (lat: number, long: number) => {
    const location = await getLocation();

    getETA({
      variables: {
        start: `${lat},${long}`,
        end: `${location.coords.latitude},${location.coords.longitude}`,
      },
    });
  });

  useEffect(() => {
    SplashScreen.hideAsync();

    const listener = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      listener.remove();
    };
  }, []);

  useEffect(() => {
    // If no ETA has been gotten, try to get it
    if (beep?.beeper.location && beep?.status === Status.ON_THE_WAY) {
      updateETA(beep.beeper.location.latitude, beep.beeper.location.longitude);
    }

    // Run some code when a beep completes
    if (previousData && !beep) {
      client.refetchQueries({ include: [GetRateData, GetBeepHistory] });
    }
  }, [beep]);

  const findBeep = handleSubmit((values) => {
    navigate("Choose Beeper", values);
  });

  function getCurrentStatusMessage(): string {
    switch (beep?.status) {
      case Status.WAITING:
        return "Waiting for beeper to accept or deny you.";
      case Status.ACCEPTED:
        return "Beeper is getting ready to come get you. They will be on the way soon.";
      case Status.ON_THE_WAY:
        return "Beeper is on their way to get you.";
      case Status.HERE:
        return `Beeper is here to pick you up in a ${beep.beeper.cars?.[0].color} ${beep.beeper.cars?.[0].make} ${beep.beeper.cars?.[0].model}`;
      case Status.IN_PROGRESS:
        return "You are currently in the car with your beeper.";
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
      <Container keyboard alignItems="center" pt={2} h="100%" px={4}>
        <Stack space={4} w="100%">
          <FormControl isInvalid={Boolean(errors.groupSize)}>
            <FormControl.Label>Group Size</FormControl.Label>
            <Controller
              name="groupSize"
              rules={{ required: "Group size is required" }}
              control={control}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Input
                  keyboardType="numeric"
                  onBlur={onBlur}
                  onChangeText={(val) => onChange(val === "" ? "" : Number(val))}
                  value={value === undefined ? "" : String(value)}
                  ref={ref}
                  returnKeyLabel="next"
                  returnKeyType="next"
                  onSubmitEditing={() => setFocus("origin")}
                  size="lg"
                />
              )}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {errors.groupSize?.message}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl isInvalid={Boolean(errors.origin)}>
            <FormControl.Label>Pick Up Location</FormControl.Label>
            <Controller
              name="origin"
              rules={{ required: "Pick up location is required" }}
              control={control}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <LocationInput
                  onBlur={onBlur}
                  onChangeText={(val) => onChange(val)}
                  value={value}
                  ref={ref}
                  returnKeyLabel="next"
                  returnKeyType="next"
                  onSubmitEditing={() => setFocus("destination")}
                  textContentType="location"
                  size="lg"
                />
              )}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {errors.origin?.message}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl
            isInvalid={
              Boolean(errors.destination)
            }
          >
            <FormControl.Label>Destination Location</FormControl.Label>
            <Controller
              name="destination"
              rules={{ required: "Destination location is required" }}
              control={control}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Input
                  onBlur={onBlur}
                  onChangeText={(val) => onChange(val)}
                  value={value}
                  ref={ref}
                  returnKeyType="go"
                  onSubmitEditing={() => findBeep()}
                  textContentType="location"
                  size="lg"
                />
              )}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {errors.destination?.message}
            </FormControl.ErrorMessage>
          </FormControl>
          <Button
            _text={{ fontWeight: "extrabold" }}
            onPress={() => findBeep()}
            size="lg"
          >
            Find Beep
          </Button>
          <BeepersMap />
        </Stack>
        <RateSheet />
      </Container>
    );
  }

  if (isAcceptedBeep) {
    return (
      <Container p={2} px={4} alignItems="center">
        <Stack alignItems="center" space={4} w="100%" h="94%">
          <Pressable
            w="100%"
            onPress={() =>
              navigate("User", { id: beep.beeper.id, beepId: beep.id })
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
              <Avatar size="xl" url={beep.beeper.photo} />
            </HStack>
          </Pressable>
          <Rates
            singles={beep.beeper.singlesRate}
            group={beep.beeper.groupRate}
          />
          {beep.position <= 0 && (
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
            </Card>
          )}
          {beep.status === Status.ON_THE_WAY && (
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
          {beep.status === Status.HERE ? (
            <Image
              borderRadius="xl"
              w="100%"
              h={48}
              flexGrow={1}
              source={{ uri: beep.beeper.cars?.[0].photo }}
              alt={`car-${beep.beeper.cars?.[0].id}`}
            />
          ) : (
            <Map
              showsUserLocation
              style={{
                flexGrow: 1,
                width: "100%",
                borderRadius: 15,
                overflow: "hidden",
              }}
              initialRegion={{
                latitude: beep.beeper.location?.latitude ?? 0,
                longitude: beep.beeper.location?.longitude ?? 0,
                longitudeDelta: 0.05,
                latitudeDelta: 0.05,
              }}
            >
              <BeeperMarker
                id={beep.beeper.id}
                latitude={beep.beeper.location?.latitude ?? 0}
                longitude={beep.beeper.location?.longitude ?? 0}
              />
            </Map>
          )}
          <Stack space={2} w="100%" alignSelf="flex-end">
            <HStack space={2} w="100%">
              <Button
                flexGrow={1}
                onPress={() =>
                  Linking.openURL(`tel:${getRawPhoneNumber(beep.beeper.phone)}`)
                }
                endIcon={
                  <Icon as={Ionicons} name="ios-call" color="white" size="md" />
                }
              >
                Call Beeper
              </Button>
              <Button
                flexGrow={1}
                onPress={() =>
                  Linking.openURL(`sms:${getRawPhoneNumber(beep.beeper.phone)}`)
                }
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

            {beep.beeper.cashapp ? (
              <Button
                onPress={() =>
                  openCashApp(
                    beep.beeper.cashapp,
                    beep.groupSize,
                    beep.beeper.groupRate,
                    beep.beeper.singlesRate
                  )
                }
              >
                Pay Beeper with Cash App
              </Button>
            ) : null}
            <HStack w="100%" space={2}>
              {beep.beeper.venmo ? (
                <Button
                  flexGrow={1}
                  colorScheme="lightBlue"
                  rightIcon={
                    <Icon as={Ionicons} size="md" name="ios-card-outline" />
                  }
                  onPress={() =>
                    openVenmo(
                      beep.beeper.venmo,
                      beep.groupSize,
                      beep.beeper.groupRate,
                      beep.beeper.singlesRate,
                      "pay"
                    )
                  }
                >
                  Pay with Venmo
                </Button>
              ) : null}
              {beep.beeper.venmo && beep.groupSize > 1 ? (
                <Button
                  rightIcon={
                    <Icon as={Ionicons} name="ios-share-outline" size="md" />
                  }
                  onPress={() =>
                    shareVenmoInformation(
                      beep.beeper.venmo,
                      beep.groupSize,
                      beep.beeper.groupRate,
                      beep.beeper.singlesRate
                    )
                  }
                >
                  Share Venmo
                </Button>
              ) : null}
            </HStack>
            {beep.position >= 1 && <LeaveButton beepersId={beep.beeper.id} />}
          </Stack>
        </Stack>
      </Container>
    );
  }

  return (
    <Container alignItems="center" p={2}>
      <Stack space={4} w="100%" alignItems="center" h="94%">
        <Avatar size={100} url={beep.beeper.photo} />
        <Center>
          <Text>Waiting on</Text>
          <Heading letterSpacing="xs" fontWeight="extrabold">
            {beep.beeper.name}
          </Heading>
          <Text>to accept your request.</Text>
        </Center>
        <Card w="100%">
          <Text>
            <Text fontWeight="extrabold">Pick Up </Text>
            <Text>{beep.origin}</Text>
          </Text>
          <Text>
            <Text fontWeight="extrabold">Destination </Text>
            <Text>{beep.destination}</Text>
          </Text>
          <Text>
            <Text fontWeight="extrabold">Number of Riders </Text>
            <Text>{beep.groupSize}</Text>
          </Text>
        </Card>
        <Rates
          singles={beep.beeper.singlesRate}
          group={beep.beeper.groupRate}
        />
        <PlaceInQueue firstName={beep.beeper.first} position={beep.position} />
        <Spacer />
        <LeaveButton beepersId={beep.beeper.id} w="100%" size="lg" />
      </Stack>
    </Container>
  );
}
