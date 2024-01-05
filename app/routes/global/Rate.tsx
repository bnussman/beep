import React, { useState } from "react";
import { ApolloError, gql, useMutation, useQuery } from "@apollo/client";
import { GetUserProfileQuery, RateUserMutation } from "../../generated/graphql";
import { RateBar } from "../../components/Rate";
import { UserHeader } from "../../components/UserHeader";
import { Button, Input, Stack, Spinner } from "tamagui";
import { Container } from "../../components/Container";
import { Alert } from "../../utils/Alert";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { GetUser } from "./Profile";

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

type Props = StaticScreenProps<{ userId: string, beepId?: string }>;

export function RateScreen({ route }: Props) {
  const [stars, setStars] = useState<number>(0);
  const [message, setMessage] = useState<string>();
  const [rate, { loading }] = useMutation<RateUserMutation>(RateUser);

  const { data } = useQuery<GetUserProfileQuery>(GetUser, {
    variables: {
      id: route.params.userId
    }
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
    <Container keyboard p="$4">
      <Stack space="$2" w="full">
        {user && (
          <UserHeader
            username={user.username}
            name={user.name}
            picture={user.photo}
          />
        )}
        <RateBar hint="Stars" value={stars} onValueChange={setStars} />
        <Input
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
          disabled={stars < 1}
          iconAfter={loading ? <Spinner /> : undefined}
        >
          Rate User
        </Button>
      </Stack>
    </Container>
  );
}
