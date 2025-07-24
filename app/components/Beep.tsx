import React from "react";
import * as ContextMenu from "zeego/context-menu";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Card } from "@/components/Card";
import { Text } from "@/components/Text";
import { Avatar } from "@/components/Avatar";
import { useUser } from "../utils/useUser";
import { openVenmo } from "@/utils/links";
import { RouterOutput, trpc } from "@/utils/trpc";
import { printStars } from "./Stars";

interface Props {
  item: RouterOutput["beep"]["beeps"]["beeps"][number];
  index: number;
}

export function Beep({ item }: Props) {
  const { user } = useUser();
  const navigation = useNavigation();
  const otherUser = user?.id === item.rider.id ? item.beeper : item.rider;
  const isRider = user?.id === item.rider.id;
  const isBeeper = user?.id === item.beeper.id;

  const myRating = item.ratings.find((r) => r.rater_id === user?.id);
  const otherUsersRating = item.ratings.find(
    (r) => r.rater_id === otherUser.id,
  );
  const utils = trpc.useUtils();
  const { mutateAsync: deleteRating } = trpc.rating.deleteRating.useMutation({
    onSuccess() {
      utils.beep.beeps.invalidate();
      utils.rating.ratings.invalidate();
    },
  });

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <Card style={{ padding: 16, gap: 8 }} variant="outlined" pressable>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Avatar size="xs" src={otherUser.photo ?? undefined} />
            <View style={{ flexShrink: 1 }}>
              <Text weight="bold" size="lg">
                {otherUser.first} {otherUser.last}
              </Text>
              <Text color="subtle" size="sm">
                {`${isRider ? "Ride" : "Beep"} - ${new Date(
                  item.start as string,
                ).toLocaleString()}`}
              </Text>
            </View>
          </View>
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ width: 96 }} weight="bold">Pick Up</Text>
              <Text style={{ textAlign: 'right', flexShrink: 1 }}>{item.origin}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ width: 96 }} weight="bold">Drop Off</Text>
              <Text style={{ textAlign: 'right', flexShrink: 1 }}>{item.destination}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text weight="bold">Group size</Text>
              <Text>{item.groupSize}</Text>
            </View>
            {item.status === "complete" && (
              <>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text weight="bold">Your Rating</Text>
                  <Text>{myRating ? printStars(myRating.stars) : "N/A"}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
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
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        {isRider && item.beeper.venmo && (
          <ContextMenu.Item
            key="pay-beeper"
            onSelect={() =>
              openVenmo(
                item.beeper.venmo,
                item.groupSize,
                item.beeper.groupRate,
                item.beeper.singlesRate,
                "pay",
              )
            }
          >
            <ContextMenu.ItemTitle>Pay Beeper with Venmo</ContextMenu.ItemTitle>
          </ContextMenu.Item>
        )}
        {isBeeper && item.rider.venmo && item.status === "complete" && (
          <ContextMenu.Item
            key="request-rider"
            onSelect={() =>
              openVenmo(
                item.rider.venmo,
                item.groupSize,
                item.beeper.groupRate,
                item.beeper.singlesRate,
                "charge",
              )
            }
          >
            <ContextMenu.ItemTitle>
              Charge Rider with Venmo
            </ContextMenu.ItemTitle>
          </ContextMenu.Item>
        )}
        {myRating && (
          <ContextMenu.Item
            key="delete-rating"
            destructive
            onSelect={() => {
              if (myRating) {
                deleteRating({ ratingId: myRating.id });
              }
            }}
          >
            <ContextMenu.ItemTitle>Delete Rating</ContextMenu.ItemTitle>
          </ContextMenu.Item>
        )}
        {!myRating && item.status === "complete" && (
          <ContextMenu.Item
            key="rate"
            onSelect={() =>
              navigation.navigate("Rate", {
                userId: otherUser.id,
                beepId: item.id,
              })
            }
          >
            <ContextMenu.ItemTitle>Rate</ContextMenu.ItemTitle>
          </ContextMenu.Item>
        )}
        <ContextMenu.Item
          key="report"
          onSelect={() =>
            navigation.navigate("Report", {
              userId: otherUser.id,
              beepId: item.id,
            })
          }
        >
          <ContextMenu.ItemTitle>Report</ContextMenu.ItemTitle>
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
