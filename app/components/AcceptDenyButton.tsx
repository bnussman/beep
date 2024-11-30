import React from "react";
import { Button } from "./Button";
import { cx } from "class-variance-authority";
import { RouterOutput, trpc } from "@/utils/trpc";

interface Props {
  type: "accept" | "deny";
  item: RouterOutput['beeper']['queue'][number];
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
      className={cx({
        ["flex-grow !bg-green-400 dark:!bg-green-400"]: isAccept,
        ["!bg-red-400 dark:!bg-red-400"]: !isAccept,
      })}
      isLoading={isPending}
      onPress={onPress}
      activityIndicatorProps={{ color: "white" }}
    >
      {isAccept ? "Accept" : "Deny"}
    </Button>
  );
}
