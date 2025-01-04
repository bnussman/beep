import React from "react";
import { Button } from "@/components/Button";
import { RouterOutput, trpc } from "@/utils/trpc";

type Status = RouterOutput['beeper']['queue'][number]['status'];

type InProgressStatuses = Exclude<
  Status,
  "complete" | "denied" | "canceled"
>;

const nextStatusMap: Record<InProgressStatuses, Status> = {
  'waiting': 'accepted',
  'accepted': 'on_the_way',
  'on_the_way': 'here',
  'here': 'in_progress',
  'in_progress': 'complete',
};

interface Props {
  beep: RouterOutput['beeper']['queue'][number];
}

export function ActionButton(props: Props) {
  const { beep } = props;
  const utils = trpc.useUtils();
  const { mutate, isPending } = trpc.beeper.updateBeep.useMutation({
    onSuccess(data, vars) {
      if (vars.data.status === 'complete') {
        utils.rider.getLastBeepToRate.invalidate();
      }
      utils.beep.beeps.invalidate();
      utils.beeper.queue.setData(undefined, data);
    },
    onError(error) {
      alert(error.message);
    }
  });

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
      }
    })
  };

  return (
    <Button isLoading={isPending} onPress={onPress} size="lg">
      {getMessage()}
    </Button>
  );
}
