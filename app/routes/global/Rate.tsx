import React, { useState } from "react";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { Beep, RateUserMutation, User } from "../../generated/graphql";
import { RateBar } from "../../components/Rate";
import { UserHeader } from "../../components/UserHeader";
import { Button, Input, Stack } from "native-base";
import { Container } from "../../components/Container";
import { Alert } from "../../utils/Alert";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";

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

type Props = StaticScreenProps<{
  user: User;
  beep?: string;
}>;

export function RateScreen({ route }: Props) {
  const params = route.params;
  const [stars, setStars] = useState<number>(0);
  const [message, setMessage] = useState<string>();
  const [rate, { loading }] = useMutation<RateUserMutation>(RateUser);

  const { goBack } = useNavigation();

  const onSubmit = () => {
    rate({
      refetchQueries: () => ["GetRatings"],
      variables: {
        userId: params.user.id,
        beepId: params.beep,
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
    <Container keyboard p={4}>
      <Stack space={4} w="full">
        <UserHeader
          username={params.user.username}
          name={params.user.name}
          picture={params.user.photo ?? ""}
        />
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
