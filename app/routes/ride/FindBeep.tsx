import React, { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { RiderForm } from "./RiderForm";
import { StaticScreenProps } from "@react-navigation/native";
import { useTRPC } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";
import { useQueryClient } from "@tanstack/react-query";
import { RideDetails } from "./RideDetails";
import { BottomSheet } from "@/components/BottomSheet";

type Props = StaticScreenProps<
  { origin?: string; destination?: string; groupSize?: string } | undefined
>;

export function MainFindBeepScreen(props: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: beep } = useQuery(trpc.rider.currentRide.queryOptions());

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

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  if (!beep) {
    return <RiderForm />;
  }

  return (
    <BottomSheet snapPoints={["20%", "85%"]}>
      <RideDetails />
    </BottomSheet>
  );
}
