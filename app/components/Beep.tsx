import React from "react";
import { View } from "react-native";
import { Card } from "@/components/Card";
import { Text } from "@/components/Text";
import { Avatar } from "@/components/Avatar";
import { useUser } from "../utils/useUser";
import { call, openCashApp, openVenmo, sms } from "@/utils/links";
import { RouterOutput, useTRPC } from "@/utils/trpc";
import { printStars } from "./Stars";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { Menu } from "./Menu";
import { Link, useRouter } from "expo-router";

interface Props {
  item: RouterOutput["beep"]["beeps"]["beeps"][number];
  index: number;
}

export function Beep({ item }: Props) {
  const { user } = useUser();
  const trpc = useTRPC();
  const router = useRouter();
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
    trpc.rating.deleteRating.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries(trpc.beep.beeps.pathFilter());
        queryClient.invalidateQueries(trpc.rating.ratings.pathFilter());
      },
    }),
  );

  return (
    <Menu
      options={[
        {
          title: 'Profile',
          onClick: () => router.navigate({ pathname: '/user/[id]', params: { id: otherUser.id, beepId: item.id } }),
          sfIcon: 'person.crop.circle',
        },
        {
          title: "Contact",
          sfIcon: 'phone.fill',
          options: [
            {
              onClick: () => call(otherUser.id),
              sfIcon: 'phone.fill',
              title: "Call",
              show: isAcceptedOrComplete,
            },
            {
              onClick: () => sms(otherUser.id),
              sfIcon: 'message.fill',
              title: "Text",
              show: isAcceptedOrComplete,
            },
          ],
        },
        {
          title: "Pay",
          show: isRider && isAcceptedOrComplete,
          sfIcon: 'dollarsign',
          options: [
            {
              title: "Venmo",
              show: Boolean(item.beeper.venmo),
              sfIcon: 'creditcard',
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
              title: "Cash App",
              show: Boolean(item.beeper.cashapp),
              sfIcon: 'dollarsign',
              onClick: () =>
                openCashApp(
                  item.beeper.cashapp,
                  item.groupSize,
                  item.beeper.groupRate,
                  item.beeper.singlesRate,
                ),
            },
          ]
        },
        {
          title: "Charge",
          sfIcon: 'dollarsign',
          show: isBeeper && isAcceptedOrComplete,
          options: [
            {
              title: "Venmo",
              show: Boolean(item.rider.venmo),
              sfIcon: 'creditcard',
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
              title: "Cash App",
              show: Boolean(item.rider.cashapp),
              sfIcon: 'dollarsign',
              onClick: () =>
                openCashApp(
                  item.rider.cashapp,
                  item.groupSize,
                  item.beeper.groupRate,
                  item.beeper.singlesRate,
                ),
            },
          ]
        },
        {
          title: "Rate",
          show: !myRating && item.status === "complete", // only allow rating if you haven't already left a rating and the beep is complete
          sfIcon: 'star.fill',
          onClick: () => router.navigate({ pathname: '/user/[id]/rate', params: { id: otherUser.id, beepId: item.id } }),
        },
        {
          title: "Report",
          sfIcon: 'exclamationmark.bubble.fill',
          onClick: () => router.navigate({ pathname: '/user/[id]/report', params: { id: otherUser.id, beepId: item.id } }),
        },
        {
          onClick: () => deleteRating({ ratingId: myRating!.id }),
          sfIcon: 'trash',
          show: Boolean(myRating),
          destructive: true,
          title: "Delete Rating",
        },
      ]}
      activationMethod="longPress"
      trigger={
        <Link href={{ pathname: '/profile/beeps/[id]', params: { id: item.id } }} asChild>
          <Link.Trigger withAppleZoom>
            <Card
              style={{ padding: 16, gap: 8 }}
              pressable
              onLongPress={() => { }}
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
          </Link.Trigger>
        </Link>
      }
    />
  );
}