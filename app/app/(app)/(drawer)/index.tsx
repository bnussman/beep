import React, { useEffect } from "react";
import { RiderForm } from "../../../components/RiderForm";
import { useTRPC } from "@/utils/trpc";
import { skipToken, useQuery } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";
import { useQueryClient } from "@tanstack/react-query";
import { RideDetails } from "../../../components/RideDetails";
import { BottomSheet } from "@/components/BottomSheet";
import { View } from "react-native";
import { RideMap } from "../../../components/RideMap";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { SplashScreen } from "expo-router";

export default function MainFindBeepScreen() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: beep } = useQuery(trpc.rider.currentRide.queryOptions());

  const isAcceptedBeep =
    beep?.status === "accepted" ||
    beep?.status === "in_progress" ||
    beep?.status === "here" ||
    beep?.status === "on_the_way";

  useSubscription(
    trpc.rider.currentRideUpdates.subscriptionOptions(undefined, {
      onData(data) {
        if (data === null) {
          queryClient.invalidateQueries(
            trpc.rider.getLastBeepToRate.pathFilter(),
          );
        }
        queryClient.setQueryData(trpc.rider.currentRide.queryKey(), data);
      },
      enabled: Boolean(beep),
    }),
  );

  const { data: beepersLocation } = useSubscription(
    trpc.rider.beeperLocationUpdates.subscriptionOptions(
      beep ? beep.beeper.id : skipToken,
      {
        enabled: isAcceptedBeep,
      },
    ),
  );

  useEffect(() => {
    SplashScreen.hide();
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
