import React, { useState } from "react";
import { ApolloError, useMutation, useQuery } from "@apollo/client";
import { RateUser } from "../routes/global/Rate";
import { Alert } from "../utils/Alert";
import { RateBar } from "./Rate";
import { Avatar } from "./Avatar";
import { useNavigation } from "@react-navigation/native";
import { Ratings } from "../routes/Ratings";
import { Button, Heading, Sheet, Spinner } from "@beep/ui";
import { graphql } from "gql.tada";
import { Pressable } from "react-native";

export const GetRateData = graphql(`
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
`);

export function RateSheet() {
  const { data } = useQuery(GetRateData);
  const [stars, setStars] = useState<number>(0);
  const [rate, { loading }] = useMutation(RateUser);
  const { navigate } = useNavigation();

  const beep = data?.getLastBeepToRate;

  const onSubmit = () => {
    rate({
      refetchQueries: [Ratings, GetRateData],
      variables: {
        userId: beep!.beeper.id,
        beepId: beep!.id,
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
      snapPoints={[325]}
      snapPointsMode="constant"
      open
      dismissOnSnapToBottom
    >
      <Sheet.Handle backgroundColor="$gray8" />
      <Sheet.Frame padding="$4" justifyContent="center" alignItems="center" elevation="$8" gap="$2">
        <Avatar url={beep.beeper.photo} size="$10" />
        <Heading fontWeight="bold">
          {beep.beeper.name}
        </Heading>
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
