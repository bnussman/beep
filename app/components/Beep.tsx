import React from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Card } from "@/components/Card";
import { Text } from "@/components/Text";
import { Avatar } from "@/components/Avatar";
import { call, openVenmo, sms } from "@/utils/links";
import { printStars } from "./Stars";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { Menu } from "./Menu";
import { orpc, Outputs, useUser } from "@/utils/orpc";

interface Props {
  item: Outputs["beep"]["beeps"]["beeps"][number];
  index: number;
}

export function Beep({ item }: Props) {
  const { data: user } = useUser();
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const otherUser = user?.id === item.rider.id ? item.beeper : item.rider;
  const isRider = user?.id === item.rider.id;
  const isBeeper = user?.id === item.beeper.id;

  const myRating = item.ratings.find((r) => r.rater_id === user?.id);
  const otherUsersRating = item.ratings.find(
    (r) => r.rater_id === otherUser.id,
  );

  const isAcceptedOrComplete =
    item.status !== "waiting" &&
    item.status !== "canceled" &&
    item.status !== "denied";

  const { mutateAsync: deleteRating } = useMutation(
    orpc.rating.deleteRating.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: orpc.beep.beeps.key() });
        queryClient.invalidateQueries({ queryKey: orpc.rating.ratings.key() });
      },
    }),
  );

  return (
    <Menu
      options={[
        {
          onClick: () => call(otherUser.id),
          title: "Call",
          show: isAcceptedOrComplete,
        },
        {
          onClick: () => sms(otherUser.id),
          title: "Text",
          show: isAcceptedOrComplete,
        },
        {
          title: "Pay Beeper With Venmo",
          show: isRider && Boolean(item.beeper.venmo) && isAcceptedOrComplete,
          onClick: () =>
            openVenmo(
              item.beeper.venmo,
              item.groupSize,
              item.beeper.groupRate,
              item.beeper.singlesRate,
              "pay",
            ),
        },
        {
          title: "Charge Rider with Venmo",
          show: isBeeper && Boolean(item.rider.venmo) && isAcceptedOrComplete,
          onClick: () =>
            openVenmo(
              item.rider.venmo,
              item.groupSize,
              item.beeper.groupRate,
              item.beeper.singlesRate,
              "charge",
            ),
        },
        {
          title: "Rate",
          show: !myRating && item.status === "complete", // only allow rating if you haven't already left a rating and the beep is complete
          onClick: () =>
            navigation.navigate("Rate", {
              userId: otherUser.id,
              beepId: item.id,
            }),
        },
        {
          title: "Report",
          onClick: () =>
            navigation.navigate("Report", {
              userId: otherUser.id,
              beepId: item.id,
            }),
        },
        {
          onClick: () => deleteRating({ ratingId: myRating!.id }),
          show: Boolean(myRating),
          destructive: true,
          title: "Delete Rating",
        },
      ]}
      activationMethod="longPress"
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
                  item.start,
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
