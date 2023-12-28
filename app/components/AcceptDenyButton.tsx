import React, { useEffect, useState } from "react";
import { Button, Spinner } from "tamagui";
import { useMutation } from "@apollo/client";
import { Alert } from "../utils/Alert";
import { Unpacked } from "../utils/constants";
import {
  GetInitialQueueQuery,
  UpdateBeeperQueueMutation,
} from "../generated/graphql";
import { UpdateBeeperQueue } from "./ActionButton";
import { Status } from "../utils/types";
import { Check, X } from "@tamagui/lucide-icons";

interface Props {
  type: "accept" | "deny";
  item: Unpacked<GetInitialQueueQuery["getQueue"]>;
}

export function AcceptDenyButton(props: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [update] = useMutation<UpdateBeeperQueueMutation>(UpdateBeeperQueue);

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

  const Icon = isAccept ? Check : X;

  return (
    <Button
      flexGrow={isAccept ? 1 : undefined}
      onPress={onPress}
      theme={isAccept ? "green" : "red"}
      iconAfter={loading ? <Spinner /> : <Icon size={22} color="white" />}
    >
      {isAccept ? "Accept" : "Deny"}
    </Button>
  );
}
