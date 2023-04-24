import React, { useEffect, useState } from "react";
import { Button, Icon } from "native-base";
import { useMutation } from "@apollo/client";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Alert } from "../utils/Alert";
import { Unpacked } from "../utils/constants";
import {
  GetInitialQueueQuery,
  UpdateBeeperQueueMutation,
} from "../generated/graphql";
import { UpdateBeeperQueue } from "./ActionButton";
import { Status } from "../utils/types";
import { Logger } from "../utils/Logger";

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

    let message = `Before accept, phone was ${props.item.rider.phone}, after it was `;

    update({
      variables: {
        id: props.item.id,
        status: props.type === "accept" ? Status.ACCEPTED : Status.DENIED,
      },
    })
      .then(({ data }) => {
        const beep = data?.setBeeperQueue.find(
          (entry) => entry.id === props.item.id
        );
        if (beep) {
          message += beep.rider.phone;
          Logger.info(message);
        }
      })
      .catch((error) => {
        Alert(error);
        setLoading(false);
      });
  };

  return (
    <Button
      flexGrow={isAccept ? 1 : undefined}
      colorScheme={isAccept ? "green" : "red"}
      _text={{ color: "white" }}
      isLoading={loading}
      onPress={onPress}
      bg={isAccept ? "green.500" : "red.500"}
      _pressed={{ bg: isAccept ? "green.600" : "red.600" }}
      endIcon={
        <Icon
          as={MaterialCommunityIcons}
          name={isAccept ? "check" : "close"}
          size={22}
          color="white"
        />
      }
    >
      {isAccept ? "Accept" : "Deny"}
    </Button>
  );
}
