import { Elipsis } from "@/components/Elipsis";
import { Menu } from "@/components/Menu";
import { isMobile } from "@/utils/constants";
import { call, openCashApp, openVenmo, sms } from "@/utils/links";
import { orpc } from "@/utils/orpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, View } from "react-native";

export function RideMenu() {
  const queryClient = useQueryClient();

  const { data: beep } = useQuery(orpc.rider.currentRide.queryOptions());

  const { mutate } = useMutation(
    orpc.rider.leaveQueue.mutationOptions({
      onSuccess() {
        queryClient.setQueryData(orpc.rider.currentRide.queryKey(), null);
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
      const message = [
        `Are you sure you want to cancel your ride with ${beep.beeper.first}?`,
      ];

      const messageMap = {
        on_the_way: "They are on the way",
        here: "They are here to pick you up",
        in_progress: "Your beep is in progress",
        canceled: null,
        accepted: null,
        denied: null,
        waiting: null,
        complete: null,
      };

      const prefix = messageMap[beep.status];

      if (prefix) {
        message.push(
          `${prefix}, so it would a major asshole move to cancel now if you haven't otherwise communicated with them.`,
          "Canceling at this stage of the beep can result in punishment.",
        );
      }

      Alert.alert(
        "Cancel this ride?",
        message.join("\n\n"),
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
          },
        ]}
      />
    </View>
  );
}
