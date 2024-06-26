import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Card } from "@/components/Card";
import { Text } from "@/components/Text";
import { useUser } from "../utils/useUser";
import { Avatar } from "@/components/Avatar";
import { printStars } from "./Stars";
import { Unpacked } from "@/utils/constants";
import { View } from "react-native";
import { useMutation } from "@apollo/client";
import { ResultOf, graphql } from "gql.tada";
import { Ratings } from "../routes/Ratings";
import * as ContextMenu from "zeego/context-menu";

type Rating = Unpacked<ResultOf<typeof Ratings>["getRatings"]["items"]>;

interface Props {
  item: Rating;
  index: number;
}

const DeleteRating = graphql(`
  mutation DeleteRating($id: String!) {
    deleteRating(id: $id)
  }
`);

export function Rating(props: Props) {
  const { item } = props;
  const { user } = useUser();
  const navigation = useNavigation();
  const otherUser = user?.id === item.rater.id ? item.rated : item.rater;

  const isRater = user?.id === item.rater.id;

  const [deleteRating] = useMutation(DeleteRating, {
    variables: {
      id: item.id,
    },
    onError(error) {
      alert(error.message);
    },
    update(cache) {
      cache.evict({
        id: cache.identify({
          __typename: "Rating",
          id: item.id,
        }),
      });
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
                <Text weight="bold">{otherUser.name}</Text>
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
          onSelect={() => navigation.navigate("Report", { userId: otherUser.id, beepId: item.beep.id })}
        >
          <ContextMenu.ItemTitle>Report</ContextMenu.ItemTitle>
        </ContextMenu.Item>
        <ContextMenu.Item
          key="delete-rating"
          onSelect={deleteRating}
          destructive
        >
          <ContextMenu.ItemTitle>Delete Rating</ContextMenu.ItemTitle>
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
