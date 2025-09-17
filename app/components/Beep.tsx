import React from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Card } from "@/components/Card";
import { Text } from "@/components/Text";
import { Avatar } from "@/components/Avatar";
import { useUser } from "../utils/useUser";
import { openVenmo } from "@/utils/links";
import { RouterOutput, useTRPC } from "@/utils/trpc";
import { printStars } from "./Stars";

import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { Menu, MenuProps } from "./Menu";

interface Props {
  item: RouterOutput["beep"]["beeps"]["beeps"][number];
  index: number;
}

export function Beep({ item }: Props) {
  const trpc = useTRPC();
  const { user } = useUser();
  const navigation = useNavigation();
  const otherUser = user?.id === item.rider.id ? item.beeper : item.rider;
  const isRider = user?.id === item.rider.id;
  const isBeeper = user?.id === item.beeper.id;

  const myRating = item.ratings.find((r) => r.rater_id === user?.id);
  const otherUsersRating = item.ratings.find(
    (r) => r.rater_id === otherUser.id,
  );
  const queryClient = useQueryClient();
  const { mutateAsync: deleteRating } = useMutation(
    trpc.rating.deleteRating.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries(trpc.beep.beeps.pathFilter());
        queryClient.invalidateQueries(trpc.rating.ratings.pathFilter());
      },
    }),
  );

  const options: MenuProps["options"] = [];

  if (isRider && item.beeper.venmo) {
    options.push({
      title: "Pay Beeper With Venmo",
      onClick: () =>
        openVenmo(
          item.beeper.venmo,
          item.groupSize,
          item.beeper.groupRate,
          item.beeper.singlesRate,
          "pay",
        ),
    });
  }

  if (isBeeper && item.rider.venmo && item.status === "complete") {
    options.push({
      title: "Charge Rider with Venmo",
      onClick: () =>
        openVenmo(
          item.rider.venmo,
          item.groupSize,
          item.beeper.groupRate,
          item.beeper.singlesRate,
          "charge",
        ),
    });
  }

  if (myRating) {
    options.push({
      onClick: () => deleteRating({ ratingId: myRating.id }),
      title: "Delete Rating",
    });
  }

  if (!myRating && item.status === "complete") {
    options.push({
      title: "Rate",
      onClick: () =>
        navigation.navigate("Rate", {
          userId: otherUser.id,
          beepId: item.id,
        }),
    });
  }

  options.push({
    title: "Report",
    onClick: () =>
      navigation.navigate("Report", {
        userId: otherUser.id,
        beepId: item.id,
      }),
  });

  return (
    <Menu
      options={options}
      trigger={
        <Card
          style={{ padding: 16, gap: 8 }}
          pressable
          onLongPress={() => {}}
          onPress={() =>
            navigation.navigate("Beep Details", { beepId: item.id })
          }
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Avatar size="xs" src={otherUser.photo ?? undefined} />
            <View style={{ flexShrink: 1 }}>
              <Text weight="bold" size="lg">
                {otherUser.first} {otherUser.last}
              </Text>
              <Text color="subtle" size="xs">
                {`${isRider ? "Ride" : "Beep"} - ${new Date(
                  item.start as string,
                ).toLocaleString()}`}
              </Text>
            </View>
          </View>
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ width: 96 }} weight="bold">
                Pick Up
              </Text>
              <Text style={{ textAlign: "right", flexShrink: 1 }}>
                {item.origin}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ width: 96 }} weight="bold">
                Drop Off
              </Text>
              <Text style={{ textAlign: "right", flexShrink: 1 }}>
                {item.destination}
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text weight="bold">Group size</Text>
              <Text>{item.groupSize}</Text>
            </View>
            {item.status === "complete" && (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text weight="bold">Your Rating</Text>
                  <Text>{myRating ? printStars(myRating.stars) : "N/A"}</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text weight="bold">{otherUser.first}'s Rating</Text>
                  <Text>
                    {otherUsersRating
                      ? printStars(otherUsersRating.stars)
                      : "N/A"}
                  </Text>
                </View>
              </>
            )}
          </View>
        </Card>
      }
    />
  );
}
