import React from "react";
import { Button } from "@/components/Button";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { orpc, Outputs } from "@/utils/orpc";

type Status = Outputs["beeper"]["queue"][number]["status"];

type InProgressStatuses = Exclude<Status, "complete" | "denied" | "canceled">;

const nextStatusMap: Record<InProgressStatuses, Status> = {
  waiting: "accepted",
  accepted: "on_the_way",
  on_the_way: "here",
  here: "in_progress",
  in_progress: "complete",
};

interface Props {
  beep: Outputs["beeper"]["queue"][number];
}

export function ActionButton(props: Props) {
  const { beep } = props;
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation(
    orpc.beeper.updateBeep.mutationOptions({
      onSuccess(data, vars) {
        if (vars.data.status === "complete") {
          queryClient.invalidateQueries({
            queryKey: orpc.rider.getLastBeepToRate.queryKey(),
          });
        }
        queryClient.invalidateQueries({ queryKey: orpc.beep.beeps.key() });
        queryClient.setQueryData(orpc.beeper.watchQueue.experimental_liveKey(), data);
      },
      onError(error) {
        alert(error.message);
      },
    }),
  );

  const getMessage = () => {
    switch (beep.status) {
      case "waiting":
        return "Accept";
      case "accepted":
        return "I'm on the way 🚕";
      case "on_the_way":
        return "I'm here 👋";
      case "here":
        return "I'm now beeping this rider 🚙";
      case "in_progress":
        return "Done beeping this rider ✅";
      default:
        return "Yikes";
    }
  };

  const onPress = () => {
    mutate({
      beepId: beep.id,
      data: {
        status: nextStatusMap[beep.status as InProgressStatuses],
      },
    });
  };

  return (
    <Button isLoading={isPending} onPress={onPress} style={{ flexGrow: 1 }}>
      {getMessage()}
    </Button>
  );
}
