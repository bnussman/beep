import React from "react";
import { LeaveButton } from "./LeaveButton";
import { View } from "react-native";
import { Avatar } from "@/components/Avatar";
import { Image } from "@/components/Image";
import { Card } from "@/components/Card";
import { Text } from "@/components/Text";
import { Rates } from "./Rates";
import { PlaceInQueue } from "./PlaceInQueue";
import { useTRPC } from "@/utils/trpc";
import { getCurrentStatusMessage } from "./utils";
import { ETA } from "./ETA";
import { skipToken, useQuery } from "@tanstack/react-query";

interface Props {
  beepersLocation:
    | {
        latitude: number;
        longitude: number;
      }
    | undefined;
}

export function RideDetails(props: Props) {
  const trpc = useTRPC();

  const { data: beep } = useQuery(trpc.rider.currentRide.queryOptions());

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

  if (!beep) {
    return null;
  }

  if (isAcceptedBeep) {
    return (
      <View
        style={{
          height: "100%",
          padding: 16,
          gap: 16,
          paddingBottom: 32,
          paddingTop: 0,
        }}
      >
        <View>
          <Text weight="800">Beeper</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text>
              {beep.beeper.first} {beep.beeper.last}
            </Text>
            <Avatar
              style={{ width: 24, height: 24 }}
              src={beep.beeper.photo ?? undefined}
            />
          </View>
        </View>
        {beep.position <= 0 && (
          <View>
            <Text weight="800">Current Status</Text>
            <Text>{getCurrentStatusMessage(beep, car)}</Text>
          </View>
        )}
        {beep.status === "here" && car && (
          <View>
            <Text weight="800">Car</Text>
            <Text style={{ marginBottom: 8 }}>
              <Text style={{ textTransform: "capitalize" }}>{car.color}</Text>{" "}
              {car.year} {car.make} {car.model}
            </Text>
            <Image
              style={{
                borderRadius: 10,
                width: "100%",
                minHeight: 150,
              }}
              resizeMode="cover"
              src={car.photo}
              alt={`car-${car.id}`}
            />
          </View>
        )}
        <View>
          <Text weight="800">Pick Up </Text>
          <Text selectable>{beep.origin}</Text>
        </View>
        <View>
          <Text weight="800">Destination </Text>
          <Text selectable>{beep.destination}</Text>
        </View>
        <Rates
          singles={beep.beeper.singlesRate}
          group={beep.beeper.groupRate}
        />
        {beep.status === "on_the_way" && (
          <ETA beeperLocation={props.beepersLocation} />
        )}
        {beep.position > 0 && (
          <PlaceInQueue
            firstName={beep.beeper.first}
            position={beep.position}
          />
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
      <LeaveButton beepersId={beep.beeper.id} />
    </View>
  );
}
