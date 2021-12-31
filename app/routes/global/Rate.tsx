import React, { useMemo, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { RateUserMutation } from "../../generated/graphql";
import { RateBar } from "../../components/Rate";
import { UserHeader } from "../../components/UserHeader";
import { Navigation } from "../../utils/Navigation";
import { Button, Input, Stack } from "native-base";
import { LocalWrapper } from "../../components/Container";

interface Props {
  route: any;
  navigation: Navigation;
}

const RateUser = gql`
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

export function RateScreen(props: Props): JSX.Element {
  const [stars, setStars] = useState<number>(0);
  const [message, setMessage] = useState<string>();
  const [rate, { loading }] = useMutation<RateUserMutation>(RateUser);

  async function rateUser() {
    try {
      await rate({
        refetchQueries: () => ["GetRateData"],
        variables: {
          userId: props.route.params.user.id,
          beepId: props.route.params.beep,
          message: message,
          stars: stars,
        },
      });
      props.navigation.goBack();
    } catch (error) {
      alert(error);
    }
  }

  return (
    <LocalWrapper alignItems="center">
      <Stack space={4} w="90%" mt={4}>
        {useMemo(
          () => (
            <UserHeader user={props.route.params.user} />
          ),
          []
        )}
        <RateBar hint="Stars" value={stars} onValueChange={setStars} />
        <Input
          h={150}
          multiline={true}
          placeholder="Your rating message goes here"
          returnKeyType="go"
          onChangeText={(text) => setMessage(text)}
          onSubmitEditing={() => rateUser()}
          blurOnSubmit={true}
        />
        <Button
          onPress={() => rateUser()}
          disabled={stars < 1}
          isLoading={loading}
        >
          Rate User
        </Button>
      </Stack>
    </LocalWrapper>
  );
}
