import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { Alert } from "../utils/alert";
import { Unpacked } from "../utils/constants";
import { UpdateBeeperQueue } from "./ActionButton";
import { Button } from "./Button";
import { Status } from "../utils/types";
import { ResultOf } from "gql.tada";
import { GetInitialQueue } from "../routes/beep/StartBeeping";
import { cx } from "class-variance-authority";

interface Props {
  type: "accept" | "deny";
  item: Unpacked<ResultOf<typeof GetInitialQueue>["getQueue"]>;
}

export function AcceptDenyButton(props: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [update] = useMutation(UpdateBeeperQueue);

  const isAccept = props.type === "accept";

  useEffect(() => {
    setLoading(false);
  }, [props.item]);

  const onPress = () => {
    setLoading(true);

    update({
      variables: {
        id: props.item.id,
        status: props.type === "accept" ? Status.ACCEPTED : Status.DENIED,
      },
    }).catch((error) => {
      Alert(error);
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
