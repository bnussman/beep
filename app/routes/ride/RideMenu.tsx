import { Elipsis } from "@/components/Elipsis";
import { Menu } from "@/components/Menu";
import { isMobile } from "@/utils/constants";
import { call, openCashApp, openVenmo, sms } from "@/utils/links";
import { useTRPC } from "@/utils/trpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, View } from "react-native";

export function RideMenu() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: beep } = useQuery(trpc.rider.currentRide.queryOptions());

  const { mutate } = useMutation(
    trpc.rider.leaveQueue.mutationOptions({
      onSuccess() {
        queryClient.setQueryData(trpc.rider.currentRide.queryKey(), null);
      },
      onError(error) {
        alert(error.message);
      },
    }),
  );

  const leaveQueue = () => {
    if (!beep) {
      return alert("You are not in a beep");
    }

    if (isMobile) {
      Alert.alert(
        "Cancel this ride?",
        `Are you sure you want to cancel your ride with ${beep.beeper.first}?`,
        [
          {
            text: "No",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => mutate({ beeperId: beep.beeper.id }),
            style: "destructive",
          },
        ],
        { cancelable: true },
      );
    } else {
      mutate({ beeperId: beep.beeper.id });
    }
  };

  if (!beep) {
    return null;
  }

  return (
    <View style={{ marginRight: 8 }}>
      <Menu
        trigger={<Elipsis />}
        options={[
          {
            title: "Contact",
            show: beep.status !== "waiting",
            options: [
              { title: "Call", onClick: () => call(beep.beeper.id) },
              { title: "Text", onClick: () => sms(beep.beeper.id) },
            ],
          },
          {
            title: "Pay",
            show: beep.status !== "waiting",
            options: [
              {
                title: "Venmo",
                show: Boolean(beep.beeper.venmo),
                onClick: () =>
                  openVenmo(
                    beep.beeper.venmo,
                    beep.groupSize,
                    beep.beeper.groupRate,
                    beep.beeper.singlesRate,
                    "pay",
                  ),
              },
              {
                title: "Cash app",
                show: Boolean(beep.beeper.cashapp),
                onClick: () =>
                  openCashApp(
                    beep.beeper.cashapp,
                    beep.groupSize,
                    beep.beeper.groupRate,
                    beep.beeper.singlesRate,
                  ),
              },
            ],
          },
          {
            title: "Cancel Ride",
            destructive: true,
            onClick: leaveQueue,
            show:
              beep.status === "waiting" ||
              beep.position >= 1 ||
              (beep.position === 0 && beep.status === "accepted"),
          },
        ]}
      />
    </View>
  );
}
