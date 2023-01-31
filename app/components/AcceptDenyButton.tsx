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
        state: props.type === "accept" ? 1 : -1,
      },
    }).catch((error) => {
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
