import React from "react";
import { Button } from "./Button";
import { RouterOutput, trpc } from "@/utils/trpc";
import { PressableProps } from "react-native";

interface Props {
  type: "accept" | "deny";
  item: RouterOutput['beeper']['queue'][number];
  style?: PressableProps['style'];
}

export function AcceptDenyButton(props: Props) {
  const utils = trpc.useUtils();

  const { mutate, isPending } = trpc.beeper.updateBeep.useMutation({
    onSuccess(data) {
      utils.beeper.queue.setData(undefined, data);
    },
    onError(error) {
      alert(error.message);
    }
  });

  const isAccept = props.type === "accept";

  const onPress = () => {
    mutate({
      beepId: props.item.id,
      data: {
        status: props.type === "accept" ? "accepted" : "denied",
      },
    });
  };

  return (
    <Button
      isLoading={isPending}
      onPress={onPress}
      activityIndicatorProps={{ color: "white" }}
      style={props.style}
    >
      {isAccept ? "Accept" : "Deny"}
    </Button>
  );
}
