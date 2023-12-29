import React, { useMemo, useRef, useState } from "react";
import { GetRateDataQuery, RateUserMutation } from "../generated/graphql";
import { ApolloError, gql, useMutation, useQuery } from "@apollo/client";
import { RateUser } from "../routes/global/Rate";
import { Alert } from "../utils/Alert";
import { RateBar } from "./Rate";
import { Avatar } from "./Avatar";
import { useNavigation } from "@react-navigation/native";
import { Navigation } from "../utils/Navigation";
import { Ratings } from "../routes/Ratings";
import { Button, H2, Stack, Spinner, Sheet } from "tamagui";
import { Pressable } from "react-native";

export const GetRateData = gql`
  query GetRateData {
    getLastBeepToRate {
      id
      beeper {
        id
        name
        username
        photo
        isBeeping
      }
    }
  }
`;

export function RateSheet() {
  const { data } = useQuery<GetRateDataQuery>(GetRateData);
  const [stars, setStars] = useState<number>(0);
  const [rate, { loading }] = useMutation<RateUserMutation>(RateUser);
  const { navigate } = useNavigation<Navigation>();

  const beep = data?.getLastBeepToRate;

  const snapPoints = useMemo(() => [42], []);

  const onSubmit = () => {
    rate({
      refetchQueries: [Ratings, GetRateData],
      variables: {
        userId: beep?.beeper.id,
        beepId: beep?.id,
        stars: stars,
      },
    })
      .catch((error: ApolloError) => {
        Alert(error);
      });
  };

  if (!beep) return null;

  return (
    <Sheet
      snapPoints={snapPoints}
      open={Boolean(beep)}
      dismissOnSnapToBottom
    >
      <Sheet.Handle />
      <Sheet.Frame padding="$4" justifyContent="center" alignItems="center" space="$5">
        <Pressable
          onPress={() =>
            navigate("Profile", { id: beep.beeper.id, beepId: beep.id })
          }
        >
          <Stack alignItems="center">
            <Avatar url={beep.beeper.photo} size="$8" />
            <H2>{beep.beeper.name}</H2>
          </Stack>
        </Pressable>
        <RateBar hint="Stars" value={stars} onValueChange={setStars} />
        <Button
          w="100%"
          onPress={onSubmit}
          disabled={stars < 1}
          iconAfter={loading ? <Spinner /> : undefined}
        >
          Rate User
        </Button>
      </Sheet.Frame>
    </Sheet>
  );
}
