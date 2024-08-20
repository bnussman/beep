import React, { useState } from 'react';
import { RouterOutput, trpc } from '../../../utils/trpc';
import { Error } from '../../../components/Error';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Textarea,
  useToast
} from "@chakra-ui/react";

interface Props {
  isOpen: boolean;
  car: RouterOutput['car']['cars']['cars'][number] | undefined;
  onClose: () => void;
}

export function DeleteCarDialog(props: Props) {
  const { isOpen, onClose, car } = props;

  const toast = useToast();
  const utils = trpc.useUtils();

  const cancelRef = React.useRef(null);
  const [reason, setReason] = useState("");

  const { mutateAsync: deleteCar, isPending, error, reset } = trpc.car.deleteCar.useMutation();

  const handleClose = () => {
    reset();
    onClose();
  };

  const doDelete = () => {
    deleteCar({ carId: car?.id ?? "", reason }).then(() => {
      toast({ title: 'Successfully deleted car', status: 'success' });
      onClose()
      utils.car.cars.invalidate();
    });
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={handleClose}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete {car?.user.first}'s {car?.make} {car?.model}?
          </AlertDialogHeader>
          <AlertDialogBody>
            {error && <Error>{error.message}</Error>}
            <FormControl>
              <FormLabel>Notification</FormLabel>
              <Textarea
                onChange={(e) => setReason(e.target.value)}
                value={reason}
              />
              <FormHelperText>Type a message here if you want the user to recieve a notification about why their car was removed</FormHelperText>
            </FormControl>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={handleClose}>
              Cancel
            </Button>
            <Button isLoading={isPending} colorScheme="red" onClick={doDelete} ml={3}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
