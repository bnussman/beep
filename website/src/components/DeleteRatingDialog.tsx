import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { orpc } from "../utils/orpc";
import { Alert, AlertDialog, Button } from "@heroui/react";

interface Props {
  isOpen: boolean;
  id: string | undefined;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DeleteRatingDialog({ isOpen, onClose, id, onSuccess }: Props) {
  const queryClient = useQueryClient();

  const {
    mutateAsync: deleteRating,
    isPending,
    error,
  } = useMutation(
    orpc.rating.deleteRating.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: orpc.rating.ratings.key()
        });
      },
    })
  );

  const onDelete = async () => {
    await deleteRating({ ratingId: id ?? "" });
    onClose();
    onSuccess?.();
  };

  return (
    <AlertDialog.Backdrop
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <AlertDialog.Container>
        <AlertDialog.Dialog>
          <AlertDialog.Header>
            <AlertDialog.Heading>Delete Rating?</AlertDialog.Heading>
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
            Are you sure you want to delete this rating?
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button variant="tertiary" onPress={onClose}>Cancel</Button>
            <Button isPending={isPending} variant="danger" onPress={onDelete}>
              Delete
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Dialog>
      </AlertDialog.Container>
    </AlertDialog.Backdrop>
  );
}
