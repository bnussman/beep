import { isMobile } from "@/utils/constants";
import { call, openCashApp, openVenmo, sms } from "@/utils/links";
import { useTRPC } from "@/utils/trpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack } from "expo-router";
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

  const onEdit = () => {
    if (!beep) {
      return;
    }

    Alert.prompt("Pick Up", "Enter your new pick up location", (newPickUp) => {
      if (!newPickUp) {
        return alert("Pick up location cannot be empty");
      }
      
      alert(newPickUp)
    }, "plain-text", beep.origin);
  };

  return (
    <>
      <Stack.Toolbar placement="left">
      </Stack.Toolbar>
      <Stack.Toolbar placement="right">
        {beep && beep.status !== "waiting" && (
          <Stack.Toolbar.Button icon="phone.fill" onPress={() => call(beep.beeper.id)} />
        )}
        {beep && beep.status !== "waiting" && (
          <Stack.Toolbar.Button icon="message.fill" onPress={() => sms(beep.beeper.id)} />
        )}
        {beep && beep.status !== "waiting" && (
          <Stack.Toolbar.Menu icon="creditcard.fill">
            <Stack.Toolbar.MenuAction icon="creditcard.and.123" onPress={() =>
              openVenmo(
                beep.beeper.venmo,
                beep.groupSize,
                beep.beeper.groupRate,
                beep.beeper.singlesRate,
                "pay",
              )}>
              Venmo
            </Stack.Toolbar.MenuAction>
            <Stack.Toolbar.MenuAction icon="dollarsign" onPress={() =>
              openCashApp(
                beep.beeper.cashapp,
                beep.groupSize,
                beep.beeper.groupRate,
                beep.beeper.singlesRate,
              )}>
              Cash App
            </Stack.Toolbar.MenuAction>
          </Stack.Toolbar.Menu>
        )}
        <Stack.Toolbar.Menu icon="pencil">
            <Stack.Toolbar.MenuAction icon="mappin" onPress={onEdit}>
              Pick Up
            </Stack.Toolbar.MenuAction>
            <Stack.Toolbar.MenuAction icon="mappin.and.ellipse" onPress={onEdit}>
              Destination
            </Stack.Toolbar.MenuAction>
            <Stack.Toolbar.MenuAction icon="person.2.fill" onPress={onEdit}>
              Group Size
            </Stack.Toolbar.MenuAction>
        </Stack.Toolbar.Menu>
        {beep && (
          <Stack.Toolbar.Button icon="xmark" variant="prominent" tintColor="#cf2f32" onPress={leaveQueue} />
        )}
      </Stack.Toolbar>
    </>
  );
}
