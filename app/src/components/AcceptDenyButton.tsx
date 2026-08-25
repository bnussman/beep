import { Button } from "./Button";
import { Alert, PressableProps } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { RouterOutputs } from "../../../api/src";
import { orpc } from "@/utils/orpc";

interface Props {
  type: "accept" | "deny";
  item: RouterOutputs["beeper"]["queue"][number];
  style?: PressableProps["style"];
}

export function AcceptDenyButton(props: Props) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation(
    orpc.beeper.updateBeep.mutationOptions({
      onSuccess(data) {
        queryClient.setQueryData(orpc.beeper.queue.queryKey(), data);
      },
      onError(error) {
        alert(error.message);
      },
    }),
  );

  const isAccept = props.type === "accept";

  const onSubmit = () => {
    mutate({
      beepId: props.item.id,
      data: {
        status: props.type === "accept" ? "accepted" : "denied",
      },
    });
  };

  const onConfirm = () => {
    Alert.alert(
      "Deny this rider?",
      `Are you sure you want to deny ${props.item.rider.first}?`,
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: onSubmit,
          style: "destructive",
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <Button
      isLoading={isPending}
      onPress={isAccept ? onSubmit : onConfirm}
      variant={isAccept ? "primary" : "danger-soft"}
      style={props.style}
    >
      {isAccept ? "Accept" : "Deny"}
    </Button>
  );
}
