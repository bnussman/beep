import React from "react";
import { orpc } from "../utils/orpc";
import { useRouter } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Alert, AlertDialog, Button, toast } from "@heroui/react";

interface Props {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteUserDialog({ isOpen, onClose, userId }: Props) {
  const router = useRouter();

  const { data: user } = useQuery(
    orpc.user.user.queryOptions({ input: userId, enabled: isOpen }),
  );

  const {
    mutate: deleteUser,
    isPending,
    error,
  } = useMutation(
    orpc.user.deleteUser.mutationOptions({
      onSuccess() {
        router.history.back();
        toast.success("User has been successfully deleted."); 
        onClose();
      },
    }),
  );

  return (
    <AlertDialog.Backdrop
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <AlertDialog.Container>
        <AlertDialog.Dialog>
          <AlertDialog.Header>
            <AlertDialog.Heading>Delete User?</AlertDialog.Heading>
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
            <p>Are you sure you want to delete {user?.first} {user?.last}?</p>
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button variant="tertiary" onPress={onClose}>Cancel</Button>
            <Button
              isPending={isPending}
              variant="danger"
              onPress={() => deleteUser(userId)}
            >
              Delete
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Dialog>
      </AlertDialog.Container>
    </AlertDialog.Backdrop>
  );
}
