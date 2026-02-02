import React, { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { RiderForm } from "./RiderForm";
import { StaticScreenProps } from "@react-navigation/native";
import { skipToken, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { RideDetails } from "./RideDetails";
import { BottomSheet } from "@/components/BottomSheet";
import { View } from "react-native";
import { RideMap } from "./RideMap";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { orpc } from "@/utils/orpc";
import { useCancelableQuery } from "@/utils/tanstack-query";

type Props = StaticScreenProps<
  { origin?: string; destination?: string; groupSize?: string } | undefined
>;

export function MainFindBeepScreen(props: Props) {
  const queryClient = useQueryClient();

  const { data: beep } = useQuery(orpc.rider.currentRide.queryOptions());

  const isAcceptedBeep =
    beep?.status === "accepted" ||
    beep?.status === "in_progress" ||
    beep?.status === "here" ||
    beep?.status === "on_the_way";

  const { data: updates } = useCancelableQuery(
    orpc.rider.currentRideUpdates.experimental_liveOptions({
      enabled: Boolean(beep)
    })
  );

  useEffect(() => {
    if (updates === null) {
      queryClient.invalidateQueries({
        queryKey: orpc.rider.getLastBeepToRate.queryKey(),
      });
    }
    queryClient.setQueryData(orpc.rider.currentRide.queryKey(), updates);
  }, [updates]);

  const { data: beepersLocation } = useCancelableQuery(
    orpc.rider.beeperLocationUpdates.experimental_liveOptions(
      {
        input: beep ? beep.beeper.id : skipToken,
        enabled: isAcceptedBeep,
      },
    ),
  );

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  if (!beep) {
    return <RiderForm />;
  }

  return (
    <View style={{ flex: 1 }}>
      <RideMap beepersLocation={beepersLocation} />
      <BottomSheet enableDynamicSizing snapPoints={["30%", "50%"]}>
        <BottomSheetView>
          <RideDetails beepersLocation={beepersLocation} />
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
