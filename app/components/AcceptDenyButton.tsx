import React from "react";
import { Button } from "./Button";
import { RouterOutput, useTRPC } from "@/utils/trpc";
import { PressableProps } from "react-native";

import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  type: "accept" | "deny";
  item: RouterOutput['beeper']['queue'][number];
  style?: PressableProps['style'];
}

export function AcceptDenyButton(props: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation(trpc.beeper.updateBeep.mutationOptions({
    onSuccess(data) {
      queryClient.setQueryData(trpc.beeper.queue.queryKey(), data);
    },
    onError(error) {
      alert(error.message);
    }
  }));

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
