import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Card, XStack, Stack, Text } from "@beep/ui";
import { useUser } from "../utils/useUser";
import { Avatar } from "./Avatar";
import { printStars } from "./Stars";
import { Unpacked, isMobile } from "../utils/constants";
import { Alert } from "react-native";
import { useMutation } from "@apollo/client";
import { ResultOf, graphql } from "gql.tada";
import { Ratings } from "../routes/Ratings";

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

  const onLongPress = () => {
    if (isMobile) {
      Alert.alert(
        "Delete Rating?",
        "Are you sure you want to delete this rating?",
        [
          {
            text: "No",
            style: "cancel",
          },
          { text: "Yes", onPress: () => deleteRating() },
        ],
        { cancelable: true },
      );
    } else {
      deleteRating();
    }
  };

  return (
    <Card
      mt="$2"
      mx="$2"
      p="$3"
      pressTheme
      hoverTheme
      onPress={() =>
        navigation.navigate("User", { id: otherUser.id, beepId: item.beep.id })
      }
      onLongPress={onLongPress}
    >
      <Stack gap="$2">
        <XStack alignItems="center" gap="$2">
          <Avatar size="sm" src={otherUser.photo ?? undefined} />
          <Stack flexShrink={1}>
            <Text fontWeight="bold">{otherUser.name}</Text>
            <Text color="$gray8">
              {`${isRater ? "You rated" : "Rated you"} - ${new Date(
                item.timestamp as string,
              ).toLocaleString(undefined, {
                dateStyle: "short",
                timeStyle: "short",
              })}`}
            </Text>
          </Stack>
          <Stack flexGrow={1} />
          <Text>{printStars(item.stars)}</Text>
        </XStack>
        {item.message && <Text>{item.message}</Text>}
      </Stack>
    </Card>
  );
}
