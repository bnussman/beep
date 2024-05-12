import React, { useState } from "react";
import { isMobile, Unpacked } from "../utils/constants";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { Button } from "@/components/Button";
import { useEffect } from "react";
import { Alert } from "react-native";
import { ResultOf } from "gql.tada";
import { GetInitialQueue } from "../routes/beep/StartBeeping";

interface Props {
  beep: Unpacked<ResultOf<typeof GetInitialQueue>["getQueue"]>;
}

export const CancelBeep = gql`
  mutation CancelBeep($id: String!) {
    cancelBeep(id: $id)
  }
`;

export function CancelButton({ beep }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [cancel] = useMutation(CancelBeep);

  useEffect(() => {
    setIsLoading(false);
  }, [beep]);

  const onPress = () => {
    if (isMobile) {
      Alert.alert(
        "Cancel Beep?",
        "Are you sure you want to cancel this beep?",
        [
          {
            text: "No",
            onPress: () => {
              setIsLoading(false);
            },
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: onCancel,
          },
        ],
        { cancelable: true },
      );
    } else {
      onCancel();
    }
  };

  const onCancel = () => {
    setIsLoading(true);
    cancel({ variables: { id: beep.id } }).catch((error: ApolloError) => {
      setIsLoading(false);
      alert(error.message);
    });
  };

  return (
    <Button
      isLoading={isLoading}
      onPress={onPress}
      className="text-white bg-red-400 dark:bg-red-400 dark:active:bg-red-500 active:bg-red-500"
    >
      Cancel Beep
    </Button>
  );
}
