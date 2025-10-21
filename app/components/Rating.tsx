import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Card } from "@/components/Card";
import { Text } from "@/components/Text";
import { useUser } from "../utils/useUser";
import { Avatar } from "@/components/Avatar";
import { printStars } from "./Stars";
import { View } from "react-native";
import { RouterOutput, useTRPC } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { Menu } from "./Menu";

type Rating = RouterOutput["rating"]["ratings"]["ratings"][number];

interface Props {
  item: Rating;
  index: number;
}

export function Rating(props: Props) {
  const trpc = useTRPC();
  const { item } = props;
  const { user } = useUser();
  const navigation = useNavigation();
  const otherUser = user?.id === item.rater.id ? item.rated : item.rater;

  const isRater = user?.id === item.rater.id;

  const queryClient = useQueryClient();

  const { mutateAsync: deleteRating } = useMutation(
    trpc.rating.deleteRating.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries(trpc.rating.ratings.pathFilter());
      },
      onError(error) {
        alert(error.message);
      },
    }),
  );

  return (
    <Menu
      activationMethod="longPress"
      options={[
        {
          title: "Report",
          onClick: () =>
            navigation.navigate("Report", {
              userId: otherUser.id,
              beepId: item.beep_id,
            }),
        },
        {
          title: "Delete Rating",
          onClick: () => deleteRating({ ratingId: item.id }),
          destructive: true,
          show: isRater,
        },
      ]}
      trigger={
        <Card
          pressable
          style={{ padding: 16, gap: 16, display: "flex" }}
          onPress={() => navigation.navigate("User", { id: otherUser.id })}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                flex: 1,
              }}
            >
              <Avatar size="xs" src={otherUser.photo ?? undefined} />
              <View style={{ flexShrink: 1 }}>
                <Text weight="bold">
                  {otherUser.first} {otherUser.last}
                </Text>
                <Text color="subtle" size="xs">
                  {`${isRater ? "You rated" : "Rated you"} - ${new Date(
                    item.timestamp as string,
                  ).toLocaleString(undefined, {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}`}
                </Text>
              </View>
            </View>
            <Text>{printStars(item.stars)}</Text>
          </View>
          {item.message && <Text>{item.message}</Text>}
        </Card>
      }
    />
  );
}
