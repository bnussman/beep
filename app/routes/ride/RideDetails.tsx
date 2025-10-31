import React from "react";
import { Pressable, View } from "react-native";
import { Avatar } from "@/components/Avatar";
import { Image } from "@/components/Image";
import { Text } from "@/components/Text";
import { Rates } from "./Rates";
import { PlaceInQueue } from "./PlaceInQueue";
import { useTRPC } from "@/utils/trpc";
import { getCurrentStatusMessage } from "./utils";
import { ETA } from "./ETA";
import { skipToken, useQuery } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";

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
  const navigation = useNavigation();

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
      <Pressable
        onPress={() => navigation.navigate("User", { id: beep.beeper.id })}
      >
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
      </Pressable>
      <View>
        <Text weight="800">Status</Text>
        {beep.status === "waiting" ? (
          <>
            <Text style={{ marginBottom: 4 }}>
              Waiting on {beep.beeper.first} to accept your request.
            </Text>
            <PlaceInQueue
              position={beep.position}
              firstName={beep.beeper.first}
            />
            {beep.riders_waiting - 1 > 0 && (
              <Text>
                {beep.riders_waiting - 1} other{" "}
                {beep.riders_waiting - 1 === 1 ? "person is" : "people are"}{" "}
                also waiting to be accepted
              </Text>
            )}
          </>
        ) : beep.position > 0 ? (
          <Text>
            <Text>Beeper has accepted you but </Text>
            <PlaceInQueue
              position={beep.position}
              firstName={beep.beeper.first}
            />
          </Text>
        ) : (
          <Text>{getCurrentStatusMessage(beep, car)}</Text>
        )}
      </View>
      {beep.status === "on_the_way" && (
        <ETA beeperLocation={props.beepersLocation} />
      )}
      {car && (
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
              height: 150,
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
      <View>
        <Text weight="800">Number of Riders </Text>
        <Text>{beep.groupSize}</Text>
      </View>
      <Rates singles={beep.beeper.singlesRate} group={beep.beeper.groupRate} />
    </View>
  );
}
