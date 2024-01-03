import React, { useState } from "react";
import { ApolloError, gql, useMutation, useQuery } from "@apollo/client";
import { GetUserProfileQuery, RateUserMutation } from "../../../generated/graphql";
import { RateBar } from "../../../components/Rate";
import { UserHeader } from "../../../components/UserHeader";
import { Button, Input, Stack } from "native-base";
import { Container } from "../../../components/Container";
import { Alert } from "../../../utils/Alert";
import { router, useLocalSearchParams } from "expo-router";
import { GetUser } from ".";

export const RateUser = gql`
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
`;

export default function RateScreen() {
  const [stars, setStars] = useState<number>(0);
  const [message, setMessage] = useState<string>();
  const [rate, { loading }] = useMutation<RateUserMutation>(RateUser);
  const params = useLocalSearchParams<{ userId: string, beepId: string }>();


  const { data } = useQuery<GetUserProfileQuery>(GetUser, {
    variables: {
      id: params.userId
    }
  });

  const user = data?.getUser;

  const onSubmit = () => {
    rate({
      refetchQueries: () => ["GetRatings"],
      variables: {
        userId: params.userId,
        beepId: params.beepId,
        message: message,
        stars: stars,
      },
    })
      .then(() => {
        router.back();
      })
      .catch((error: ApolloError) => {
        Alert(error);
      });
  };

  return (
    <Container keyboard p={4}>
      <Stack space={4} w="full">
        {user &&
          <UserHeader
            username={user.username}
            name={user.name}
            picture={user.photo}
          />
        }
        <RateBar hint="Stars" value={stars} onValueChange={setStars} />
        <Input
          size="lg"
          h={100}
          multiline={true}
          placeholder="Your rating message goes here"
          returnKeyType="go"
          onChangeText={(text) => setMessage(text)}
          onSubmitEditing={onSubmit}
          blurOnSubmit={true}
        />
        <Button onPress={onSubmit} isDisabled={stars < 1} isLoading={loading}>
          Rate User
        </Button>
      </Stack>
    </Container>
  );
}
