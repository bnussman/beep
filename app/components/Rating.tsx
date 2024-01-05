import React from "react";
import { useNavigation } from "@react-navigation/native";
import { XStack, Spacer, Stack, SizableText } from "tamagui";
import { GetRatingsQuery } from "../generated/graphql";
import { useUser } from "../utils/useUser";
import { Avatar } from "./Avatar";
import { printStars } from "./Stars";
import { Unpacked, isMobile } from "../utils/constants";
import { Card } from "./Card";
import { Alert } from "react-native";
import { gql, useMutation } from "@apollo/client";

type Rating = Unpacked<GetRatingsQuery["getRatings"]["items"]>;

interface Props {
  item: Rating;
  index: number;
}

const DeleteRating = gql`
  mutation DeleteRating($id: String!) {
    deleteRating(id: $id)
  }
`;

export function Rating(props: Props) {
  const { item } = props;
  const { user } = useUser();
  const navigation = useNavigation();
  const otherUser = user?.id === item.rater.id ? item.rated : item.rater;

  const isRater = user?.id === item.rater.id;

  const [deleteRating] = useMutation(DeleteRating, {
    variables: {
      id: item.id
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
    }
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
        { cancelable: true }
      );
    } else {
      deleteRating();
    }
  };

  return (
    <Card
      pressable
      onPress={() => navigation.navigate("User", { id: otherUser.id, beepId: item.beep.id })}
      onLongPress={onLongPress}
      mx="$2"
      my={4}
    >
      <Stack space={2}>
        <XStack alignItems="center" space="$2">
          <Avatar size="$4" url={otherUser.photo} />
          <Stack flexGrow={1}>
            <SizableText fontWeight="bold" letterSpacing={0.1}>
              {otherUser.name}
            </SizableText>
            <SizableText fontSize="$2">
              {`${isRater ? "You rated" : "Rated you"} - ${new Date(
                item.timestamp
              ).toLocaleString(undefined, { dateStyle: 'short', timeStyle: "short" })}`}
            </SizableText>
          </Stack>
          <SizableText>{printStars(item.stars)}</SizableText>
        </XStack>
        {item.message && <SizableText>{item.message}</SizableText>}
      </Stack>
    </Card>
  );
}
