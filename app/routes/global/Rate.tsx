import React, { useState } from "react";
import { ApolloError, useMutation, useQuery } from "@apollo/client";
import { RateBar } from "../../components/Rate";
import { UserHeader } from "../../components/UserHeader";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { Alert } from "../../utils/alert";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import { graphql } from "gql.tada";

export const GetUser = graphql(`
  query GetUserProfile($id: String!) {
    getUser(id: $id) {
      username
      name
      photo
    }
  }
`);

export const RateUser = graphql(`
  mutation RateUser(
    $userId: String!
    $stars: Float!
    $message: String
    $beepId: String!
  ) {
    rateUser(
      input: {
        userId: $userId
        beepId: $beepId
        stars: $stars
        message: $message
      }
    )
  }
`);

type Props = StaticScreenProps<{ userId: string; beepId: string }>;

export function RateScreen({ route }: Props) {
  const [stars, setStars] = useState<number>(0);
  const [message, setMessage] = useState<string>();
  const [rate, { loading }] = useMutation(RateUser);

  const { data } = useQuery(GetUser, {
    variables: {
      id: route.params.userId,
    },
  });

  const { goBack } = useNavigation();

  const user = data?.getUser;

  const onSubmit = () => {
    rate({
      refetchQueries: () => ["GetRatings"],
      variables: {
        userId: route.params.userId,
        beepId: route.params.beepId,
        message: message,
        stars: stars,
      },
    })
      .then(() => {
        goBack();
      })
      .catch((error: ApolloError) => {
        Alert(error);
      });
  };

  return (
    <View className="p-4 gap-4">
      {user && (
        <UserHeader
          username={user.username}
          name={user.name}
          picture={user.photo}
        />
      )}
      <RateBar hint="Stars" value={stars} onValueChange={setStars} />
      <Text>Message (optional)</Text>
      <Input
        multiline
        className="h-24"
        returnKeyType="go"
        onChangeText={(text) => setMessage(text)}
        onSubmitEditing={onSubmit}
        blurOnSubmit={true}
      />
      <Button onPress={onSubmit} disabled={stars < 1} isLoading={loading}>
        Rate User
      </Button>
    </View>
  );
}
