import React, { useMemo, useRef, useState } from "react";
import { GetRateDataQuery, RateUserMutation } from "../generated/graphql";
import { BottomSheet } from "./BottomSheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { ApolloError, gql, useMutation, useQuery } from "@apollo/client";
import { Alert } from "../utils/Alert";
import { RateBar } from "./Rate";
import { Avatar } from "./Avatar";
import { useNavigation } from "@react-navigation/native";
import { Ratings } from "../app/(app)/ratings";
import { Button, Center, Heading, Pressable, Spacer } from "native-base";
import { RateUser } from "../app/user/[id]/rate";
import { router } from "expo-router";

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
      <Center padding={4} height="100%">
        <Pressable
          w="100%"
          alignItems="center"
          onPress={() => router.push({ pathname: "/user/[id]/", params: { id: beep.beeper.id, beep: beep.id } })}
        >
          <Avatar
            url={beep.beeper.photo}
            size="xl"
            online={beep.beeper.isBeeping}
            badgeSize="6"
          />
          <Heading
            fontSize="3xl"
            fontWeight="extrabold"
            letterSpacing="sm"
            isTruncated
          >
            {beep.beeper.name}
          </Heading>
          <Spacer />
        </Pressable>
        <Spacer />
        <RateBar hint="Stars" value={stars} onValueChange={setStars} />
        <Spacer />
        <Button
          w="100%"
          onPress={onSubmit}
          isDisabled={stars < 1}
          isLoading={loading}
        >
          Rate User
        </Button>
      </Center>
    </BottomSheet>
  );
}
