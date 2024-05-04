import React, { useState } from "react";
import { ApolloError, useMutation, useQuery } from "@apollo/client";
import { RateBar } from "../../components/Rate";
import { UserHeader } from "../../components/UserHeader";
import { Label, Spinner, Stack } from "@beep/ui";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Container } from "../../components/Container";
import { Alert } from "../../utils/alert";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { GetUser } from "./Profile";
import { graphql } from "gql.tada";

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
    <Container keyboard p="$4">
      <Stack gap="$4" w="full">
        {user && (
          <UserHeader
            username={user.username}
            name={user.name}
            picture={user.photo}
          />
        )}
        <RateBar hint="Stars" value={stars} onValueChange={setStars} />
        <Stack>
          <Label htmlFor="message" fontWeight="bold">
            Message (optional)
          </Label>
          <Input
            multiline
            className="h-24"
            returnKeyType="go"
            onChangeText={(text) => setMessage(text)}
            onSubmitEditing={onSubmit}
            blurOnSubmit={true}
          />
        </Stack>
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
