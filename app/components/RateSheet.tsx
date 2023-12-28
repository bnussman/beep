import React, { useMemo, useRef, useState } from "react";
import { GetRateDataQuery, RateUserMutation } from "../generated/graphql";
import { BottomSheet } from "./BottomSheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { ApolloError, gql, useMutation, useQuery } from "@apollo/client";
import { RateUser } from "../routes/global/Rate";
import { Alert } from "../utils/Alert";
import { RateBar } from "./Rate";
import { Avatar } from "./Avatar";
import { useNavigation } from "@react-navigation/native";
import { Navigation } from "../utils/Navigation";
import { Ratings } from "../routes/Ratings";
import { Button, H2, Heading, Stack } from "tamagui";
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

  const bottomSheetRef = useRef<BottomSheetMethods>(null);

  const snapPoints = useMemo(() => ["42%"], []);

  const onSubmit = () => {
    rate({
      refetchQueries: [Ratings],
      variables: {
        userId: beep?.beeper.id,
        beepId: beep?.id,
        stars: stars,
      },
    })
      .then(() => {
        bottomSheetRef.current?.close();
      })
      .catch((error: ApolloError) => {
        Alert(error);
      });
  };

  if (!beep) return null;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      bottomInset={45}
      detached={true}
      containerStyle={{ marginLeft: 20, marginRight: 20 }}
      enablePanDownToClose
      shadow="light"
    >
      <Stack alignItems="center">
        <Pressable
          onPress={() =>
            navigate("Profile", { id: beep.beeper.id, beepId: beep.id })
          }
        >
          <Avatar
            url={beep.beeper.photo}
            size="$8"
          />
          <H2>
            {beep.beeper.name}
          </H2>
        </Pressable>
        <RateBar hint="Stars" value={stars} onValueChange={setStars} />
        <Button
          w="100%"
          onPress={onSubmit}
          disabled={stars < 1}
          isLoading={loading}
        >
          Rate User
        </Button>
      </Stack>
    </BottomSheet>
  );
}
