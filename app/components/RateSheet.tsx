import React, { useMemo, useRef, useState } from "react";
import { BottomSheet } from "./BottomSheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { ApolloError, gql, useMutation, useQuery } from "@apollo/client";
import { RateUser } from "../routes/global/Rate";
import { Alert } from "../utils/Alert";
import { RateBar } from "./Rate";
import { Avatar } from "./Avatar";
import { useNavigation } from "@react-navigation/native";
import { Ratings } from "../routes/Ratings";
import { Button, Center, Heading, Pressable, Spacer } from "native-base";
import { graphql } from "gql.tada";

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
          onPress={() =>
            navigate("User", { id: beep.beeper.id, beepId: beep.id })
          }
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
