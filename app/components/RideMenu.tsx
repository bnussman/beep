import { Elipsis } from "@/components/Elipsis";
import { Menu } from "@/components/Menu";
import { isMobile } from "@/utils/constants";
import { call, openCashApp, openVenmo, sms } from "@/utils/links";
import { useTRPC } from "@/utils/trpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack } from "expo-router";
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
    <Stack.Toolbar placement="right">
      <Stack.Toolbar.Menu icon="ellipsis">
        {beep.status !== "waiting" && (
          <Stack.Toolbar.Menu inline title="Contact">
            <Stack.Toolbar.MenuAction onPress={() => call(beep.beeper.id)}>
              Call
            </Stack.Toolbar.MenuAction>
            <Stack.Toolbar.MenuAction onPress={() => sms(beep.beeper.id)}>
              Text
            </Stack.Toolbar.MenuAction>
          </Stack.Toolbar.Menu>
        )}
        {beep.status !== "waiting" && (
          <Stack.Toolbar.Menu inline title="Pay">
            <Stack.Toolbar.MenuAction onPress={() =>
              openVenmo(
                beep.beeper.venmo,
                beep.groupSize,
                beep.beeper.groupRate,
                beep.beeper.singlesRate,
                "pay",
              )}>
              Venmo
            </Stack.Toolbar.MenuAction>
            <Stack.Toolbar.MenuAction onPress={() =>
              openCashApp(
                beep.beeper.cashapp,
                beep.groupSize,
                beep.beeper.groupRate,
                beep.beeper.singlesRate,
              )}>
              Cashapp
            </Stack.Toolbar.MenuAction>
          </Stack.Toolbar.Menu>
        )}
        <Stack.Toolbar.MenuAction onPress={leaveQueue} destructive>
          Cancel Ride
        </Stack.Toolbar.MenuAction>
      </Stack.Toolbar.Menu>
    </Stack.Toolbar>
  );
}
