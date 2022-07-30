import React, { useMemo, useState } from "react";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { RateUserMutation } from "../../generated/graphql";
import { RateBar } from "../../components/Rate";
import { UserHeader } from "../../components/UserHeader";
import { Navigation } from "../../utils/Navigation";
import { Button, Input, Stack } from "native-base";
import { Container } from "../../components/Container";
import { Alert } from "../../utils/Alert";
import { useNavigation, useRoute } from "@react-navigation/native";

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

export function RateScreen() {
  const [stars, setStars] = useState<number>(0);
  const [message, setMessage] = useState<string>();
  const [rate, { loading }] = useMutation<RateUserMutation>(RateUser);

  const { params } = useRoute<any>();
  const { goBack } = useNavigation<Navigation>();

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
  }

  return (
    <Container alignItems="center" keyboard>
      <Stack space={4} w="90%" mt={4}>
        {useMemo(
          () => (
            <UserHeader user={params.user} />
          ),
          []
        )}
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
        <Button
          onPress={onSubmit}
          isDisabled={stars < 1}
          isLoading={loading}
        >
          Rate User
        </Button>
      </Stack>
    </Container>
  );
}
