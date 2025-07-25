import React, { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { LocationInput } from "../../components/LocationInput";
import { Controller, useForm } from "react-hook-form";
import { BeepersMap } from "./BeepersMap";
import { Map } from "../../components/Map";
import { LeaveButton } from "./LeaveButton";
import { View, Linking } from "react-native";
import { Avatar } from "@/components/Avatar";
import { Image } from "@/components/Image";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Label } from "@/components/Label";
import { Text } from "@/components/Text";
import { Rates } from "./Rates";
import { PlaceInQueue } from "./PlaceInQueue";
import { BeeperMarker } from "../../components/Marker";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { RouterInput, trpc } from "@/utils/trpc";
import { getCurrentStatusMessage } from "./utils";
import { ETA } from "./ETA";
import {
  getRawPhoneNumber,
  openCashApp,
  openVenmo,
  shareVenmoInformation,
} from "../../utils/links";
import { RateLastBeeper } from "./RateLastBeeper";

type Props = StaticScreenProps<
  { origin?: string; destination?: string; groupSize?: string } | undefined
>;

export function MainFindBeepScreen(props: Props) {
  const { navigate } = useNavigation();

  const utils = trpc.useUtils();
  const { data: beep } = trpc.rider.currentRide.useQuery();


  const isAcceptedBeep =
    beep?.status === "accepted" ||
    beep?.status === "in_progress" ||
    beep?.status === "here" ||
    beep?.status === "on_the_way";

  trpc.rider.currentRideUpdates.useSubscription(undefined, {
    onData(data) {
      if (data === null) {
        utils.rider.getLastBeepToRate.invalidate();
      }
      utils.rider.currentRide.setData(undefined, data);
    },
    enabled: Boolean(beep),
  });

  trpc.rider.beeperLocationUpdates.useSubscription(beep?.beeper.id ?? "", {
    enabled: isAcceptedBeep,
    onData(updatedLocation) {
      utils.rider.currentRide.setData(undefined, (prev) => {
        if (!prev) {
          return undefined;
        }
        return {
          ...prev,
          beeper: {
            ...prev.beeper,
            location: updatedLocation.location,
          },
        };
      });
    },
  });


  const {
    control,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<Omit<RouterInput["rider"]["startBeep"], "beeperId">>({
    defaultValues: {
      groupSize: undefined,
      origin: props.route.params?.origin ?? "",
      destination: props.route.params?.destination ?? "",
    },
    values: {
      // @ts-expect-error we don't want a default group size
      groupSize: props.route.params?.groupSize
        ? Number(props.route.params.groupSize)
        : undefined,
      origin: props.route.params?.origin ?? "",
      destination: props.route.params?.destination ?? "",
    },
  });

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  const findBeep = handleSubmit(async (values) => {
    // @ts-expect-error i don't even care
    navigate("Choose Beeper", values);
  });

  if (!beep) {
    return (
      <KeyboardAwareScrollView scrollEnabled={false} contentContainerStyle={{ padding: 16, gap: 8 }}>
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
              textContentType="fullStreetAddress"
            />
          )}
        />
        <Text color="error">{errors.destination?.message}</Text>
        <Button onPress={() => findBeep()}>
          Find Beep
        </Button>
        <BeepersMap />
        <RateLastBeeper />
      </KeyboardAwareScrollView>
    );
  }

  if (isAcceptedBeep) {
    return (
      <View style={{ height: '100%', padding: 16, gap: 16, paddingBottom: 8 }}>
        <View style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between'}}>
          <View style={{ flexShrink: 1 }}>
            <Text size="3xl" weight="800">
              {beep.beeper.first} {beep.beeper.last}
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
          <Card variant="outlined" style={{ gap: 8 }}>
            <Text weight="800" size="xl">
              Current Status
            </Text>
            <Text>{getCurrentStatusMessage(beep)}</Text>
          </Card>
        )}
        {beep.status === "on_the_way" && (
          <ETA beeperLocation={beep.beeper.location} />
        )}
        {beep.position > 0 && (
          <PlaceInQueue
            firstName={beep.beeper.first}
            position={beep.position}
          />
        )}
        {beep.status === "here" ? (
          <Image
            style={{ flexGrow: 1, borderRadius: 12, width: "100%", minHeight: 100 }}
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
        <View style={{ gap: 8 }}>
          <View style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
            <Button
              style={{ flexGrow: 1 }}
              onPress={() =>
                Linking.openURL(`tel:${getRawPhoneNumber(beep.beeper.phone)}`)
              }
            >
              Call 📞
            </Button>
            <Button
              style={{ flexGrow: 1 }}
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
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {beep.beeper.venmo && (
              <Button
                style={{ flexGrow: 1 }}
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
        {(beep.position >= 1 ||
          (beep.position === 0 && beep.status === "accepted")) && (
          <LeaveButton beepersId={beep.beeper.id} />
        )}
      </View>
    );
  }

  return (
    <View style={{ height: '100%', padding: 16, gap: 16, paddingBottom: 8, alignItems: 'center' }}>
      <Avatar size="xl" src={beep.beeper.photo ?? undefined} />
      <View style={{ alignItems:'center', gap: 8}}>
        <Text>Waiting on</Text>
        <Text size="4xl" weight="800">
          {beep.beeper.first} {beep.beeper.last}
        </Text>
        <Text>to accept your request.</Text>
      </View>
      <Card style={{ padding: 8, width: '100%', gap: 16 }} variant="outlined">
        <View>
          <Text weight="bold">Pick Up </Text>
          <Text>{beep.origin}</Text>
        </View>
        <View>
          <Text weight="bold">Destination </Text>
          <Text>{beep.destination}</Text>
        </View>
        <View>
          <Text weight="bold">Number of Riders </Text>
          <Text>{beep.groupSize}</Text>
        </View>
      </Card>
      <Rates singles={beep.beeper.singlesRate} group={beep.beeper.groupRate} />
      <PlaceInQueue firstName={beep.beeper.first} position={beep.position} />
      <View style={{ flexGrow: 1 }} />
      <LeaveButton beepersId={beep.beeper.id} />
    </View>
  );
}
