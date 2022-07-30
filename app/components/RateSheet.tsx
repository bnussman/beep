import React, { useMemo, useRef, useState } from "react";
import { Center, Heading, HStack, Pressable, Spacer } from "native-base";
import { GetRateDataQuery, RateUserMutation } from "../generated/graphql";
import { BottomSheet } from "./BottomSheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { ApolloError, gql, useMutation, useQuery } from "@apollo/client";
import { RateUser } from "../routes/global/Rate";
import { Alert } from "../utils/Alert";
import { RateBar } from "./Rate";
import { Avatar } from "./Avatar";
import { GradietnButton } from "./GradientButton";
import { useNavigation } from "@react-navigation/native";
import { Navigation } from "../utils/Navigation";
import { Ratings } from "../routes/Ratings";

export const GetRateData = gql`
  query GetRateData {
    getLastBeepToRate {
      id
      beeper {
        id
        name
        username
        photoUrl
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

  const snapPoints = useMemo(() => ["30%"], []);

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
  }

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
        <Pressable onPress={() => navigate("Profile", { id: beep.beeper.id, beep: beep.id })}>
          <HStack space={2} alignItems='center'>
            <Avatar url={beep.beeper.photoUrl} />
            <Heading fontWeight="extrabold" letterSpacing="sm">{beep.beeper.name}</Heading>
          </HStack>
        </Pressable>
        <RateBar hint="Stars" value={stars} onValueChange={setStars} />
        <Spacer />
        <GradietnButton
          w="100%"
          size="sm"
          onPress={onSubmit}
          isDisabled={stars < 1}
          isLoading={loading}
        >
          Rate User
        </GradietnButton>
      </Center>
    </BottomSheet>
  );

}