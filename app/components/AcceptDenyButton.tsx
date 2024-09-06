import React, { useEffect, useState } from "react";
import { Button } from "./Button";
import { Status } from "../utils/types";
import { cx } from "class-variance-authority";
import { RouterOutput, trpc } from "@/utils/trpc";

interface Props {
  type: "accept" | "deny";
  item: RouterOutput['beeper']['queue'][number];
}

export function AcceptDenyButton(props: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const { mutateAsync: update } = trpc.beeper.updateBeep.useMutation();

  const isAccept = props.type === "accept";

  useEffect(() => {
    setLoading(false);
  }, [props.item]);

  const onPress = () => {
    setLoading(true);

    update({
      beepId: props.item.id,
      data: {
        status: props.type === "accept" ? Status.ACCEPTED : Status.DENIED,
      },
    }).catch((error) => {
      alert(error.message);
      setLoading(false);
    });
  };

  return (
    <Button
      className={cx({
        ["flex-grow !bg-green-400 dark:!bg-green-400"]: isAccept,
        ["!bg-red-400 dark:!bg-red-400"]: !isAccept,
      })}
      isLoading={loading}
      onPress={onPress}
      activityIndicatorProps={{ color: "white" }}
    >
      {isAccept ? "Accept" : "Deny"}
    </Button>
  );
}
