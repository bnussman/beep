import React, { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { LocationInput } from "../../components/LocationInput";
import { Controller, useForm } from "react-hook-form";
import { BeepersMap } from "./BeepersMap";
import { useLocation } from "../../utils/useLocation";
import { Map } from "../../components/Map";
import { useNavigation } from "@react-navigation/native";
import { GetRateData, RateSheet } from "../../components/RateSheet";
import { LeaveButton } from "./LeaveButton";
import { Linking, AppState, AppStateStatus, Pressable } from "react-native";
import { cache, client } from "../../utils/apollo";
import { Container } from "../../components/Container";
import { useUser } from "../../utils/useUser";
import { Status } from "../../utils/types";
import { Avatar } from "../../components/Avatar";
import { Image } from "../../components/Image";
import { Rates } from "./Rates";
import { PlaceInQueue } from "./PlaceInQueue";
import { GetBeepHistory } from "../Beeps";
import {
  getRawPhoneNumber,
  openCashApp,
  openVenmo,
  shareVenmoInformation,
} from "../../utils/links";
import {
  useLazyQuery,
  useQuery,
  useSubscription,
} from "@apollo/client";
import { VariablesOf, graphql } from "gql.tada";
import { ChooseBeep } from '../ride/PickBeep';
import { BeeperMarker } from "../../components/Marker";
import { Card, Label, Input, Text, Button, Heading, XStack, Stack, Spinner } from "@beep/ui";
import { CreditCard, MessageCircle, PhoneCall, Share } from "@tamagui/lucide-icons";

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
    variables: { id: beep?.beeper.id ?? "" },
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

  const updateETA = async () => {
    const location = await getLocation();

    if (beep?.beeper.location) {
      getETA({
        variables: {
          start: `${beep.beeper.location.longitude},${beep.beeper.location.latitude}`,
          end: `${location.coords.longitude},${location.coords.latitude}`,
        },
      });
    }
  };

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
      updateETA();
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
        <Heading fontWeight="bold">You are beeping!</Heading>
        <Text>You can&apos;t find a ride when you are beeping</Text>
      </Container>
    );
  }

  if (!beep) {
    return (
      <Container keyboard alignItems="center" px="$4">
        <Stack w="100%">
          <Label htmlFor="groupSize" fontWeight="bold">Group Size</Label>
          <Controller
            name="groupSize"
            rules={{ required: "Group size is required" }}
            control={control}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                id="groupSize"
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={(val) => onChange(val === "" ? "" : Number(val))}
                value={value === undefined ? "" : String(value)}
                ref={ref}
                returnKeyLabel="next"
                returnKeyType="next"
                onSubmitEditing={() => setFocus("origin")}
              />
            )}
          />
          <Text color="red">
            {errors.groupSize?.message}
          </Text>
          <Label htmlFor="origin" fontWeight="bold">Pick Up Location</Label>
          <Controller
            name="origin"
            rules={{ required: "Pick up location is required" }}
            control={control}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <LocationInput
                id="origin"
                onBlur={onBlur}
                onChangeText={(val) => onChange(val)}
                value={value}
                inputRef={ref}
                returnKeyLabel="next"
                returnKeyType="next"
                onSubmitEditing={() => setFocus("destination")}
                textContentType="location"
              />
            )}
          />
          <Text color="red">
            {errors.origin?.message}
          </Text>
          <Label htmlFor="destination" fontWeight="bold">Destination Location</Label>
          <Controller
            name="destination"
            rules={{ required: "Destination location is required" }}
            control={control}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                id="destination"
                onBlur={onBlur}
                onChangeText={(val) => onChange(val)}
                value={value}
                ref={ref}
                returnKeyType="go"
                onSubmitEditing={() => findBeep()}
                textContentType="location"
              />
            )}
          />
          <Text color="red">
            {errors.destination?.message}
          </Text>
          <Button onPress={() => findBeep()} mt="$4" mb="$4">
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
      <Container p="$3" alignItems="center">
        <Stack alignItems="center" gap="$4" w="100%" height="94%">
          <Pressable style={{ width: "100%" }} onPress={() => navigate("User", { id: beep.beeper.id, beepId: beep.id }) }>
            <XStack alignItems="center" gap="$4" w="100%">
              <Stack flexShrink={1}>
                <Heading fontWeight="bold">
                  {beep.beeper.name}
                </Heading>
                <Text>
                  <Text fontWeight="bold">Pick Up </Text>
                  <Text>{beep.origin}</Text>
                </Text>
                <Text>
                  <Text fontWeight="bold">Destination </Text>
                  <Text>{beep.destination}</Text>
                </Text>
              </Stack>
              <Stack flexGrow={1} />
              <Avatar size="$8" url={beep.beeper.photo} />
            </XStack>
          </Pressable>
          <Rates
            singles={beep.beeper.singlesRate}
            group={beep.beeper.groupRate}
          />
          {beep.position <= 0 && (
            <Card w="100%" p="$3" animation="quick" enterStyle={{ scale: 0.5 }} key={beep.status}>
              <Heading fontWeight="bold" mb={1}>
                Current Status
              </Heading>
              <Text>{getCurrentStatusMessage()}</Text>
            </Card>
          )}
          {beep.status === Status.ON_THE_WAY && (
            <Card w="100%" p="$3">
              <XStack alignItems="center">
                <Heading fontWeight="bold">
                  ETA
                </Heading>
                <Stack flexGrow={1} />
                {etaError ? (
                  <Text>{etaError.message}</Text>
                ) : eta?.getETA ? (
                  <Text>{eta.getETA}</Text>
                ) : (
                  <Spinner />
                )}
              </XStack>
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
              borderRadius="$4"
              w="100%"
              h="$16"
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
                latitude={beep.beeper.location?.latitude ?? 0}
                longitude={beep.beeper.location?.longitude ?? 0}
              />
            </Map>
          )}
          <Stack gap="$2" w="100%">
            <XStack gap="$2" w="100%">
              <Button
                flexGrow={1}
                iconAfter={<PhoneCall />}
                onPress={() =>
                  Linking.openURL(`tel:${getRawPhoneNumber(beep.beeper.phone)}`)
                }
              >
                Call Beeper
              </Button>
              <Button
                flexGrow={1}
                onPress={() =>
                  Linking.openURL(`sms:${getRawPhoneNumber(beep.beeper.phone)}`)
                }
                iconAfter={<MessageCircle />}
              >
                Text Beeper
              </Button>
            </XStack>

            {beep.beeper.cashapp && (
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
            )}
            <XStack w="100%" gap="$2">
              {beep.beeper.venmo && (
                <Button
                  flexGrow={1}
                  theme="blue"
                  iconAfter={<CreditCard />}
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
              )}
              {beep.beeper.venmo && beep.groupSize > 1 && (
                <Button
                  iconAfter={<Share />}
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
              )}
            </XStack>
            {beep.position >= 1 && <LeaveButton beepersId={beep.beeper.id} />}
          </Stack>
        </Stack>
      </Container>
    );
  }

  return (
    <Container alignItems="center" p="$3">
      <Stack gap="$4" w="100%" alignItems="center" h="94%">
        <Avatar size={100} url={beep.beeper.photo} />
        <Stack justifyContent="center" ai="center">
          <Text>Waiting on</Text>
          <Heading fontWeight="bold">
            {beep.beeper.name}
          </Heading>
          <Text>to accept your request.</Text>
        </Stack>
        <Card w="100%" p="$3">
          <Text>
            <Text fontWeight="bold">Pick Up </Text>
            <Text>{beep.origin}</Text>
          </Text>
          <Text>
            <Text fontWeight="bold">Destination </Text>
            <Text>{beep.destination}</Text>
          </Text>
          <Text>
            <Text fontWeight="bold">Number of Riders </Text>
            <Text>{beep.groupSize}</Text>
          </Text>
        </Card>
        <Rates
          singles={beep.beeper.singlesRate}
          group={beep.beeper.groupRate}
        />
        <PlaceInQueue firstName={beep.beeper.first} position={beep.position} />
        <Stack flexGrow={1} />
        <LeaveButton beepersId={beep.beeper.id} w="100%" />
      </Stack>
    </Container>
  );
}
