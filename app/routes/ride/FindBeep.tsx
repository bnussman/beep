import React, { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { Map } from "../../components/Map";
import { LeaveButton } from "./LeaveButton";
import { View } from "react-native";
import { Avatar } from "@/components/Avatar";
import { Image } from "@/components/Image";
import { Card } from "@/components/Card";
import { Text } from "@/components/Text";
import { Rates } from "./Rates";
import { PlaceInQueue } from "./PlaceInQueue";
import { AnimatedMarker } from "../../components/AnimatedMarker";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { useTRPC } from "@/utils/trpc";
import { getCurrentStatusMessage } from "./utils";
import { ETA } from "./ETA";
import { skipToken, useQuery } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";
import { useQueryClient } from "@tanstack/react-query";
import { StartBeepForm } from "./StartBeepForm";

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
    return <StartBeepForm {...props.route.params} />;
  }

  if (isAcceptedBeep) {
    return (
      <View
        style={{
          height: "100%",
          paddingHorizontal: 16,
          paddingTop: 16,
          gap: 8,
          paddingBottom: 32,
        }}
      >
        <Card
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexShrink: 1 }}>
            <Text size="xl" weight="800">
              {beep.beeper.first} {beep.beeper.last}
            </Text>
            <Text color="subtle">is your beeper</Text>
          </View>
          <Avatar size="md" src={beep.beeper.photo ?? undefined} />
        </Card>
        <Card style={{ gap: 8 }}>
          <View>
            <Text weight="bold">Pick Up</Text>
            <Text selectable>{beep.origin}</Text>
          </View>
          <View>
            <Text weight="bold">Destination </Text>
            <Text selectable>{beep.destination}</Text>
          </View>
          <Rates
            singles={beep.beeper.singlesRate}
            group={beep.beeper.groupRate}
          />
        </Card>
        {beep.riders_before_accepted === 0 && (
          <Card style={{ gap: 8 }}>
            <Text weight="800" size="lg">
              Current Status
            </Text>
            <Text>{getCurrentStatusMessage(beep, car)}</Text>
          </Card>
        )}
        {beep.status === "on_the_way" && (
          <ETA beeperLocation={beepersLocation} />
        )}
        {beep.riders_before_accepted > 0 && (
          <PlaceInQueue
            firstName={beep.beeper.first}
            riders_before_accepted={beep.riders_before_accepted}
            riders_before_unaccepted={beep.riders_before_unaccepted}
            total_riders_waiting={beep.total_riders_waiting}
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
        <Avatar size="md" src={beep.beeper.photo ?? undefined} />
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
        <Rates
          singles={beep.beeper.singlesRate}
          group={beep.beeper.groupRate}
        />
      </Card>
      <PlaceInQueue
        firstName={beep.beeper.first}
        riders_before_accepted={beep.riders_before_accepted}
        riders_before_unaccepted={beep.riders_before_unaccepted}
        total_riders_waiting={beep.total_riders_waiting}
      />
      <View style={{ flexGrow: 1 }} />
      <LeaveButton beepersId={beep.beeper.id} />
    </View>
  );
}
