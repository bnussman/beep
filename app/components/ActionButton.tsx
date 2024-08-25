import React, { useState } from "react";
import { Button } from "@/components/Button";
import { useEffect } from "react";
import { RouterOutput, trpc } from "@/utils/trpc";
import { TRPCClientError } from "@trpc/client";

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
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync: update } = trpc.beeper.updateBeep.useMutation();
  const utils = trpc.useUtils();

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

  useEffect(() => {
    setIsLoading(false);
  }, [beep]);

  const onPress = () => {
    setIsLoading(true);
    update({
        beepId: beep.id,
        data: {
          status: nextStatusMap[beep.status as InProgressStatuses],
        }
    }).then((data) => {
      utils.beeper.queue.setData(undefined, data);
    }).catch((error: TRPCClientError<any>) => {
      setIsLoading(false);
      alert(error.message);
    });
  };

  return (
    <Button isLoading={isLoading} onPress={onPress} size="lg">
      {getMessage()}
    </Button>
  );
}
