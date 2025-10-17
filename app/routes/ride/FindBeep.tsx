import React, { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { Map } from "../../components/Map";
import { LeaveButton } from "./LeaveButton";
import { View } from "react-native";
import { Avatar } from "@/components/Avatar";
import { Image } from "@/components/Image";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { Rates } from "./Rates";
import { PlaceInQueue } from "./PlaceInQueue";
import { AnimatedMarker } from "../../components/AnimatedMarker";
import { RiderForm } from "./RiderForm";
import { StaticScreenProps } from "@react-navigation/native";
import { useTRPC } from "@/utils/trpc";
import { getCurrentStatusMessage } from "./utils";
import { ETA } from "./ETA";
import { skipToken, useQuery } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";
import { useQueryClient } from "@tanstack/react-query";
import {
  call,
  openCashApp,
  openVenmo,
  shareVenmoInformation,
  sms,
} from "../../utils/links";

type Props = StaticScreenProps<
  { origin?: string; destination?: string; groupSize?: string } | undefined
>;

export function MainFindBeepScreen(props: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: beep } = useQuery(trpc.rider.currentRide.queryOptions());

  useSubscription(
    trpc.rider.currentRideUpdates.subscriptionOptions(undefined, {
      onData(data) {
        if (data === null) {
          queryClient.invalidateQueries(
            trpc.rider.getLastBeepToRate.pathFilter(),
          );
        }
        queryClient.setQueryData(trpc.rider.currentRide.queryKey(), data);
      },
      enabled: Boolean(beep),
    }),
  );

  const isAcceptedBeep =
    beep?.status === "accepted" ||
    beep?.status === "in_progress" ||
    beep?.status === "here" ||
    beep?.status === "on_the_way";

  const { data: car } = useQuery(
    trpc.user.getUsersDefaultCar.queryOptions(
      beep ? beep.beeper.id : skipToken,
      { enabled: isAcceptedBeep },
    ),
  );

  const { data: beepersLocation } = useSubscription(
    trpc.rider.beeperLocationUpdates.subscriptionOptions(
      beep ? beep.beeper.id : skipToken,
      {
        enabled: isAcceptedBeep,
      },
    ),
  );

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  if (!beep) {
    return <RiderForm />;
  }

  if (isAcceptedBeep) {
    return (
      <View style={{ height: "100%", padding: 16, gap: 16, paddingBottom: 32 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
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
          <Card style={{ gap: 8 }}>
            <Text weight="800" size="xl">
              Current Status
            </Text>
            <Text>{getCurrentStatusMessage(beep, car)}</Text>
          </Card>
        )}
        {beep.status === "on_the_way" && (
          <ETA beeperLocation={beepersLocation} />
        )}
        {beep.position > 0 && (
          <PlaceInQueue
            firstName={beep.beeper.first}
            position={beep.position}
          />
        )}
        {beep.status === "here" && car ? (
          <Image
            style={{
              flexGrow: 1,
              borderRadius: 12,
              width: "100%",
              minHeight: 100,
            }}
            resizeMode="cover"
            src={car.photo}
            alt={`car-${car.id}`}
          />
        ) : beepersLocation ? (
          <Map
            showsUserLocation
            style={{
              flexGrow: 1,
              width: "100%",
              borderRadius: 15,
              overflow: "hidden",
            }}
            initialRegion={{
              latitude: beepersLocation.latitude,
              longitude: beepersLocation.longitude,
              longitudeDelta: 0.05,
              latitudeDelta: 0.05,
            }}
          >
            <AnimatedMarker
              latitude={beepersLocation.latitude}
              longitude={beepersLocation.longitude}
            />
          </Map>
        ) : null}
        <View style={{ gap: 8 }}>
          <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
            <Button
              style={{ flexGrow: 1 }}
              onPress={() => call(beep.beeper.id)}
            >
              Call 📞
            </Button>
            <Button style={{ flexGrow: 1 }} onPress={() => sms(beep.beeper.id)}>
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
          <View style={{ flexDirection: "row", gap: 8 }}>
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
    <View
      style={{
        height: "100%",
        padding: 16,
        gap: 16,
        paddingBottom: 32,
      }}
    >
      <Card
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexShrink: 1 }}>
          <Text color="subtle">Waiting on</Text>
          <Text size="xl" weight="800">
            {beep.beeper.first} {beep.beeper.last}
          </Text>
          <Text color="subtle">to accept your request.</Text>
        </View>
        <Avatar size="lg" src={beep.beeper.photo ?? undefined} />
      </Card>
      <Card style={{ width: "100%", gap: 16 }}>
        <View>
          <Text weight="bold">Pick Up </Text>
          <Text selectable>{beep.origin}</Text>
        </View>
        <View>
          <Text weight="bold">Destination </Text>
          <Text selectable>{beep.destination}</Text>
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
