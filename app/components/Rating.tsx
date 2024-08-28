import React from "react";
import * as ContextMenu from "zeego/context-menu";
import { useNavigation } from "@react-navigation/native";
import { Card } from "@/components/Card";
import { Text } from "@/components/Text";
import { useUser } from "../utils/useUser";
import { Avatar } from "@/components/Avatar";
import { printStars } from "./Stars";
import { View } from "react-native";
import { RouterOutput, trpc } from "@/utils/trpc";

type Rating = RouterOutput['rating']['ratings']['ratings'][number];

interface Props {
  item: Rating;
  index: number;
}

export function Rating(props: Props) {
  const { item } = props;
  const { user } = useUser();
  const navigation = useNavigation();
  const otherUser = user?.id === item.rater.id ? item.rated : item.rater;

  const isRater = user?.id === item.rater.id;

  const utils = trpc.useUtils();

  const { mutateAsync: deleteRating } = trpc.rating.deleteRating.useMutation({
    onSuccess() {
      utils.rating.ratings.invalidate();
    },
    onError(error) {
      alert(error.message);
    },
  });

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger action="press">
        <Card variant="outlined" pressable className="p-4 flex gap-4">
          <View className="flex flex-row items-center justify-between">
            <View className="flex flex-row items-center gap-2">
              <Avatar size="xs" src={otherUser.photo ?? undefined} />
              <View className="flex-shrink">
                <Text weight="bold">{otherUser.first} {otherUser.last}</Text>
                <Text color="subtle" size="sm">
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
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item
          key="report"
          onSelect={() => navigation.navigate("Report", { userId: otherUser.id, beepId: item.beep_id })}
        >
          <ContextMenu.ItemTitle>Report</ContextMenu.ItemTitle>
        </ContextMenu.Item>
        <ContextMenu.Item
          key="delete-rating"
          onSelect={() => deleteRating({ ratingId: item.id })}
          destructive
        >
          <ContextMenu.ItemTitle>Delete Rating</ContextMenu.ItemTitle>
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
