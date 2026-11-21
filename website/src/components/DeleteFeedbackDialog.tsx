import React from "react";
import { orpc } from "../utils/orpc";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { RouterOutputs } from "../../../api/src";
import { Alert, AlertDialog, Button } from "@heroui/react";

type Feedback = RouterOutputs["feedback"]["feedback"]["feedback"][number];

interface Props {
  isOpen: boolean;
  feedback: Feedback | undefined;
  onClose: () => void;
}

export function DeleteFeedbackDialog(props: Props) {
  const { isOpen, onClose, feedback } = props;

  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error, reset } = useMutation(
    orpc.feedback.deleteFeedback.mutationOptions({
      onSuccess() {
        onClose();

        queryClient.invalidateQueries({
          queryKey: orpc.feedback.feedback.key()
        });
      }
    })
  );

  const handleClose = () => {
    reset();
    onClose();
  };

  const onDelete = () => {
    if (feedback) {
      mutateAsync(feedback.id);
    }
  };

  return (
    <AlertDialog.Backdrop
      isOpen={isOpen}
      onOpenChange={(open) => !open && handleClose()}
    >
      <AlertDialog.Container>
        <AlertDialog.Dialog>
          <AlertDialog.Header>
            <AlertDialog.Heading>
              Delete {feedback?.user.first} {feedback?.user.last}'s feedback?
            </AlertDialog.Heading>
          </AlertDialog.Header>
          <AlertDialog.Body className="flex flex-col gap-4">
            {error && (
              <Alert status="danger">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>{error.message}</Alert.Title>
                </Alert.Content>
              </Alert>
            )}
            Are you sure you want to delete this feedback?
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button variant="tertiary" onPress={handleClose}>Cancel</Button>
            <Button isPending={isPending} variant="danger" onPress={onDelete}>
              Delete
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Dialog>
      </AlertDialog.Container>
    </AlertDialog.Backdrop>
  );
}
