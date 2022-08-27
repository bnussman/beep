import React, { useEffect, useRef } from "react";
import LocationInput from "../../components/LocationInput";
import * as SplashScreen from "expo-splash-screen";
import { Controller, useForm } from "react-hook-form";
import { useValidationErrors } from "../../utils/useValidationErrors";
import { BeepersMap } from "./BeepersMap";
import { useLocation } from "../../utils/useLocation";
import { Map } from "../../components/Map";
import { useNavigation } from "@react-navigation/native";
import { GetRateData, RateSheet } from "../../components/RateSheet";
import { LeaveButton } from "./LeaveButton";
import { Ionicons } from "@expo/vector-icons";
import { Linking, AppState, AppStateStatus } from "react-native";
import { cache, client } from "../../utils/Apollo";
import { Container } from "../../components/Container";
import { Navigation } from "../../utils/Navigation";
import { EmailNotVerfiedCard } from "../../components/EmailNotVerifiedCard";
import { Alert } from "../../utils/Alert";
import { useUser } from "../../utils/useUser";
import { throttle } from "../../utils/throttle";
import { Subscription } from "../../utils/types";
import { Avatar } from "../../components/Avatar";
import { Rates } from "./Rates";
import { Card } from "../../components/Card";
import { PlaceInQueue } from "./PlaceInQueue";
import { GetBeepHistory } from "../Beeps";
import {
  ChooseBeepMutation,
  ChooseBeepMutationVariables,
  GetEtaQuery,
  GetInitialRiderStatusQuery,
} from "../../generated/graphql";
import {
  openCashApp,
  openVenmo,
  shareVenmoInformation,
} from "../../utils/links";
import {
  ApolloError,
  gql,
  useLazyQuery,
  useMutation,
  useQuery,
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
} from "native-base";
import { Marker } from "react-native-maps";

const ChooseBeep = gql`
  mutation ChooseBeep(
    $beeperId: String!
    $origin: String!
    $destination: String!
    $groupSize: Float!
  ) {
    chooseBeep(
      beeperId: $beeperId
      input: {
        origin: $origin
        destination: $destination
        groupSize: $groupSize
      }
    ) {
      id
      position
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

const InitialRiderStatus = gql`
  query GetInitialRiderStatus {
    getRiderStatus {
      id
      position
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

  const { getLocation } = useLocation(false);

  const { navigate } = useNavigation<Navigation>();

  const { data, previousData, refetch } = useQuery<GetInitialRiderStatusQuery>(
    InitialRiderStatus,
    {
      notifyOnNetworkStatusChange: true,
    }
  );

  const [getETA, { data: eta, error: etaError }] =
    useLazyQuery<GetEtaQuery>(GetETA);

  const [getBeep, { loading: isGetBeepLoading, error: getBeepError }] =
    useMutation<ChooseBeepMutation>(ChooseBeep);

  const {
    control,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<ChooseBeepMutationVariables>();

  const validationErrors =
    useValidationErrors<ChooseBeepMutationVariables>(getBeepError);

  const beep = data?.getRiderStatus;

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const listener = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      listener.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      refetch();
    }

    appState.current = nextAppState;
  };

  async function updateETA(lat: number, long: number): Promise<void> {
    const location = await getLocation();

    getETA({
      variables: {
        start: `${lat},${long}`,
        end: `${location.coords.latitude},${location.coords.longitude}`,
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

      cache.modify({
        id: cache.identify({
          __typename: "User",
          id: beep?.beeper.id,
        }),
        fields: {
          location() {
            return {
              latitude: values.data.getLocationUpdates.latitude,
              longitude: values.data.getLocationUpdates.longitude,
            };
          },
        },
      });

      // const rideStatusData = { ...data };

      // if (rideStatusData.getRiderStatus?.beeper.location) {
      //   rideStatusData.getRiderStatus.beeper.location.latitude =
      //     values.data.getLocationUpdates.latitude;
      //   rideStatusData.getRiderStatus.beeper.location.longitude =
      //     values.data.getLocationUpdates.longitude;

      //   client.writeQuery({
      //     query: InitialRiderStatus,
      //     data: { getRiderStatus: rideStatusData },
      //   });
      // }
    });
  }

  const throttleUpdateETA = throttle(10000, updateETA);

  useEffect(() => {
    SplashScreen.hideAsync();
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
      (beep?.state === 1 && previousData?.getRiderStatus?.state === 0) ||
      (beep !== undefined && beep !== null && beep.state > 0 && !previousData)
    ) {
      subscribeToLocation();
    }
    if (beep?.state === 3 && previousData?.getRiderStatus?.state === 2) {
      sub?.unsubscribe();
    }
    if (beep?.beeper.location && beep?.state === 2) {
      updateETA(beep.beeper.location.latitude, beep.beeper.location.longitude);
    }
    if (previousData && !beep) {
      client.refetchQueries({ include: [GetRateData, GetBeepHistory] });
      riderStatusSub?.unsubscribe();
    }
  }, [data]);

  async function findBeep(): Promise<void> {
    try {
      const location = await getLocation();

      return navigate("Choose Beeper", {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        handlePick: (id: string) =>
          handleSubmit((values) => chooseBeep(id, values))(),
      });
    } catch (error) {
      alert("You must enable location to get a beep.");
    }
  }

  const chooseBeep = async (
    id: string,
    values: ChooseBeepMutationVariables
  ) => {
    console.log(id, values);
    try {
      const { data } = await getBeep({
        variables: {
          ...values,
          beeperId: id,
        },
      });

      if (data) {
        client.writeQuery({
          query: InitialRiderStatus,
          data: { getRiderStatus: { ...data.chooseBeep } },
        });

        subscribeToRiderStatus();
      }
    } catch (error) {
      Alert(error as ApolloError);
    }
  };

  function getCurrentStatusMessage(): string {
    switch (beep?.state) {
      case 0:
        return "Waiting for beeper to accept or deny you.";
      case 1:
        return "Beeper is getting ready to come get you.";
      case 2:
        return "Beeper is on their way to get you.";
      case 3:
        return "Beeper is here to pick you up!";
      case 4:
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
          <FormControl
            isInvalid={
              Boolean(errors.groupSize) || Boolean(validationErrors?.groupSize)
            }
          >
            <FormControl.Label>Group Size</FormControl.Label>
            <Controller
              name="groupSize"
              rules={{ required: "Group size is required" }}
              control={control}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Input
                  keyboardType="numeric"
                  onBlur={onBlur}
                  onChangeText={(val) =>
                    onChange(val === "" ? undefined : Number(val))
                  }
                  value={value === undefined ? undefined : String(value)}
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
              {validationErrors?.groupSize?.[0]}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl
            isInvalid={
              Boolean(errors.origin) || Boolean(validationErrors?.origin)
            }
          >
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
              {validationErrors?.origin?.[0]}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl
            isInvalid={
              Boolean(errors.destination) ||
              Boolean(validationErrors?.destination)
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
              {validationErrors?.destination?.[0]}
            </FormControl.ErrorMessage>
          </FormControl>
          <Button
            _text={{ fontWeight: "extrabold" }}
            onPress={() => findBeep()}
            isLoading={isGetBeepLoading}
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

  if (beep.state > 0) {
    return (
      <Container p={2} px={4} alignItems="center">
        <Stack alignItems="center" space={4} w="100%" h="94%">
          <Pressable
            w="100%"
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
          {beep.state === 2 && (
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
          <Map
            showsUserLocation
            style={{ flexGrow: 1, width: "100%", borderRadius: 15 }}
            initialRegion={{
              latitude: beep.beeper.location?.latitude ?? 0,
              longitude: beep.beeper.location?.longitude ?? 0,
              longitudeDelta: 0.05,
              latitudeDelta: 0.05,
            }}
          >
            <Marker
              coordinate={{
                latitude: beep.beeper.location?.latitude ?? 0,
                longitude: beep.beeper.location?.longitude ?? 0,
              }}
            >
              <Text fontSize="xl">🚕</Text>
            </Marker>
          </Map>
          <Stack space={2} w="100%">
            <Button
              onPress={() => Linking.openURL(`tel:${beep.beeper.phone}`)}
              endIcon={
                <Icon as={Ionicons} name="ios-call" color="white" size="md" />
              }
            >
              Call Beeper
            </Button>
            <Button
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
              {beep.groupSize > 1 ? (
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
        <PlaceInQueue firstName={beep.beeper.first} position={beep.position} />
        <Spacer />
        <LeaveButton beepersId={beep.beeper.id} w="100%" size="lg" />
      </Stack>
    </Container>
  );
}
