import React, { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { LocationInput } from "../../components/LocationInput";
import { Controller, useForm } from "react-hook-form";
import { BeepersMap } from "./BeepersMap";
import { useLocation } from "../../utils/useLocation";
import { Map } from "../../components/Map";
import { LeaveButton } from "./LeaveButton";
import {
  View,
  Linking,
  AppState,
  AppStateStatus,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { cache, client } from "../../utils/apollo";
import { useUser } from "../../utils/useUser";
import { Status } from "../../utils/types";
import { Avatar } from "@/components/Avatar";
import { Image } from "@/components/Image";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Label } from "@/components/Label";
import { Text } from "@/components/Text";
import { Rates } from "./Rates";
import { PlaceInQueue } from "./PlaceInQueue";
import { GetBeepHistory } from "../Beeps";
import {
  getRawPhoneNumber,
  openCashApp,
  openVenmo,
  shareVenmoInformation,
} from "../../utils/links";
import { useLazyQuery, useQuery, useSubscription } from "@apollo/client";
import { VariablesOf, graphql } from "gql.tada";
import { ChooseBeep } from "../ride/PickBeep";
import { BeeperMarker } from "../../components/Marker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";

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


type Props = StaticScreenProps<{ origin?: string, destination?: string, groupSize?: string } | undefined>;

export function MainFindBeepScreen(props: Props) {
  const { user } = useUser();
  const { getLocation } = useLocation(false);
  const { navigate } = useNavigation();

  const { data, previousData, refetch } = useQuery(InitialRiderStatus, {
    notifyOnNetworkStatusChange: true,
  });

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
    reset,
    formState: { errors },
  } = useForm<Omit<VariablesOf<typeof ChooseBeep>, "beeperId">>({
    defaultValues: {
      groupSize: undefined,
      origin: props.route.params?.origin,
      destination: props.route.params?.destination,
    },
    values: {
      // @ts-expect-error we don't want a default group size'
      groupSize: props.route.params?.groupSize ? Number(props.route.params.groupSize) : undefined,
      origin: props.route.params?.origin ?? '',
      destination: props.route.params?.destination ?? '',
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
      client.refetchQueries({ include: [GetBeepHistory] });
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
      <View>
        <Text weight="bold">You are beeping!</Text>
        <Text>You can&apos;t find a ride when you are beeping</Text>
      </View>
    );
  }

  if (!beep) {
    return (
      <KeyboardAwareScrollView
        scrollEnabled={false}
        contentContainerClassName="p-4"
      >
        <Label htmlFor="groupSize">Group Size</Label>
        <Controller
          name="groupSize"
          rules={{
            required: "Group size is required",
            validate: (value) => {
              if (value > 100) {
                return "Too large";
              }
              if (value < 1) {
                return "Too small";
              }
              return true;
            },
          }}
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              id="groupSize"
              inputMode="numeric"
              onBlur={onBlur}
              onChangeText={(value) => {
                if (value === "") {
                  onChange("");
                } else if (value.length > 3) {
                  onChange(Number(value.substring(0, 3)));
                } else {
                  onChange(Number(value));
                }
              }}
              value={value === undefined ? "" : String(value)}
              ref={ref}
              returnKeyLabel="next"
              returnKeyType="next"
              onSubmitEditing={() => setFocus("origin")}
            />
          )}
        />
        <Text color="error">{errors.groupSize?.message}</Text>
        <Label htmlFor="origin">Pick Up Location</Label>
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
        <Text color="error">{errors.origin?.message}</Text>
        <Label htmlFor="destination">Destination Location</Label>
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
        <Text color="error">{errors.destination?.message}</Text>
        <Button onPress={() => findBeep()} className="my-4">
          Find Beep
        </Button>
        <BeepersMap />
        {/* <RateSheet /> */}
      </KeyboardAwareScrollView>
    );
  }

  if (isAcceptedBeep) {
    return (
      <View className="h-full p-4 gap-4 pb-8">
        <View className="flex flex-row w-full justify-between">
          <View className="flex-shrink">
            <Text size="3xl" weight="black" className="mb-2">
              {beep.beeper.name}
            </Text>
            <Text>
              <Text weight="bold">Pick Up </Text>
              <Text>{beep.origin}</Text>
            </Text>
            <Text>
              <Text weight="bold">Destination </Text>
              <Text>{beep.destination}</Text>
            </Text>
          </View>
          <Avatar size="lg" src={beep.beeper.photo ?? undefined} />
        </View>
        <Rates
          singles={beep.beeper.singlesRate}
          group={beep.beeper.groupRate}
        />
        {beep.position <= 0 && (
          <Card variant="outlined" className="p-4 gap-2">
            <Text weight="black" size="xl">
              Current Status
            </Text>
            <Text>{getCurrentStatusMessage()}</Text>
          </Card>
        )}
        {beep.status === Status.ON_THE_WAY && (
          <Card
            variant="outlined"
            className="p-4 flex flex-row justify-between items-center"
          >
            <Text size="xl" weight="black">
              ETA
            </Text>
            {etaError ? (
              <Text>{etaError.message}</Text>
            ) : eta?.getETA ? (
              <Text>{eta.getETA}</Text>
            ) : (
              <ActivityIndicator />
            )}
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
            className="flex-grow rounded-xl w-full min-h-4"
            resizeMode="cover"
            src={beep.beeper.cars?.[0].photo}
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
        <View className="gap-2">
          <View className="flex flex-row gap-2">
            <Button
              className="flex-grow"
              onPress={() =>
                Linking.openURL(`tel:${getRawPhoneNumber(beep.beeper.phone)}`)
              }
            >
              Call 📞
            </Button>
            <Button
              className="flex-grow"
              onPress={() =>
                Linking.openURL(`sms:${getRawPhoneNumber(beep.beeper.phone)}`)
              }
            >
              Text 💬
            </Button>
          </View>
          {beep.beeper.cashapp && (
            <Button
              onPress={() =>
                openCashApp(
                  beep.beeper.cashapp,
                  beep.groupSize,
                  beep.beeper.groupRate,
                  beep.beeper.singlesRate,
                )
              }
            >
              Pay Beeper with Cash App 💵
            </Button>
          )}
          <View className="flex flex-row gap-2">
            {beep.beeper.venmo && (
              <Button
                className="flex-grow"
                onPress={() =>
                  openVenmo(
                    beep.beeper.venmo,
                    beep.groupSize,
                    beep.beeper.groupRate,
                    beep.beeper.singlesRate,
                    "pay",
                  )
                }
              >
                Pay with Venmo 💵
              </Button>
            )}
            {beep.beeper.venmo && beep.groupSize > 1 && (
              <Button
                onPress={() =>
                  shareVenmoInformation(
                    beep.beeper.venmo,
                    beep.groupSize,
                    beep.beeper.groupRate,
                    beep.beeper.singlesRate,
                  )
                }
              >
                Share Venmo 🔗
              </Button>
            )}
          </View>
        </View>
        {beep.position >= 1 && <LeaveButton beepersId={beep.beeper.id} />}
      </View>
    );
  }

  return (
    <View className="h-full p-4 gap-4 pb-8 items-center">
      <Avatar size="xl" src={beep.beeper.photo ?? undefined} />
      <View className="items-center gap-1">
        <Text>Waiting on</Text>
        <Text size="4xl" weight="black">
          {beep.beeper.name}
        </Text>
        <Text>to accept your request.</Text>
      </View>
      <Card className="p-4 w-full" variant="outlined">
        <Text>
          <Text weight="bold">Pick Up </Text>
          <Text>{beep.origin}</Text>
        </Text>
        <Text>
          <Text weight="bold">Destination </Text>
          <Text>{beep.destination}</Text>
        </Text>
        <Text>
          <Text weight="bold">Number of Riders </Text>
          <Text>{beep.groupSize}</Text>
        </Text>
      </Card>
      <Rates singles={beep.beeper.singlesRate} group={beep.beeper.groupRate} />
      <PlaceInQueue firstName={beep.beeper.first} position={beep.position} />
      <View className="flex flex-grow" />
      <LeaveButton beepersId={beep.beeper.id} />
    </View>
  );
}
