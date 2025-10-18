import { Menu } from "@/components/Menu";
import { Text } from "@/components/Text";
import { isMobile } from "@/utils/constants";
import { call, openCashApp, openVenmo, sms } from "@/utils/links";
import { useTRPC } from "@/utils/trpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

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
        "Leave Queue?",
        "Are you sure you want to cancel your ride?",
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
    <Menu
      trigger={
        <Text size="3xl" style={{ marginRight: 8 }}>
          🧰
        </Text>
      }
      options={[
        {
          title: "Contact",
          type: "submenu",
          show: beep.status !== "waiting",
          options: [
            { title: "Call", onClick: () => call(beep.beeper.id) },
            { title: "Text", onClick: () => sms(beep.beeper.id) },
          ],
        },
        {
          title: "Pay",
          type: "submenu",
          show: beep.status !== "waiting",
          options: [
            {
              title: "Venmo",
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
        },
      ]}
    />
  );
}
