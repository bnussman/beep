import React, { useEffect, useState } from "react";
import { Button, Spinner } from "@beep/ui";
import { useMutation } from "@apollo/client";
import { Alert } from "../utils/alert";
import { Unpacked } from "../utils/constants";
import { UpdateBeeperQueue } from "./ActionButton";
import { Status } from "../utils/types";
import { ResultOf } from "gql.tada";
import { GetInitialQueue } from "../routes/beep/StartBeeping";
import { Check, X } from "@tamagui/lucide-icons";

interface Props {
  type: "accept" | "deny";
  item: Unpacked<ResultOf<typeof GetInitialQueue>['getQueue']>;
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
      flexGrow={isAccept ? 1 : undefined}
      theme={isAccept ? "green" : "red"}
      iconAfter={loading ? <Spinner /> : undefined}
      onPress={onPress}
      icon={isAccept ? <Check /> : <X />}
    >
      {isAccept ? "Accept" : "Deny"}
    </Button>
  );
}
