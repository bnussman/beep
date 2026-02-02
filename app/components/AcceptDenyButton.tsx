import React from "react";
import { Button } from "./Button";
import { Alert, PressableProps } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { orpc, Outputs } from "@/utils/orpc";

interface Props {
  type: "accept" | "deny";
  item: Outputs["beeper"]["queue"][number];
  style?: PressableProps["style"];
}

export function AcceptDenyButton(props: Props) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation(
    orpc.beeper.updateBeep.mutationOptions({
      onSuccess(data) {
        queryClient.setQueryData(orpc.beeper.watchQueue.experimental_liveKey(), data);
      },
      onError(error) {
        alert(error.message);
      },
    }),
  );

  const isAccept = props.type === "accept";

  const onSubmit = () => {
    mutate({
      beepId: props.item.id,
      data: {
        status: props.type === "accept" ? "accepted" : "denied",
      },
    });
  };

  const onConfirm = () => {
    Alert.alert(
      "Deny this rider?",
      `Are you sure you want to deny ${props.item.rider.first}?`,
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: onSubmit,
          style: "destructive",
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <Button
      isLoading={isPending}
      onPress={isAccept ? onSubmit : onConfirm}
      style={props.style}
      color={isAccept ? "green" : "red"}
    >
      {isAccept ? "Accept" : "Deny"}
    </Button>
  );
}
