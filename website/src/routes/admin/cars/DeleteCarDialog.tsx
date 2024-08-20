import React, { useState } from 'react';
import { Error } from '../../../components/Error';
import { useMutation } from '@apollo/client';
import { graphql } from 'gql.tada';
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
import { RouterOutput, trpc } from '../../../utils/trpc';

interface Props {
  isOpen: boolean;
  car: RouterOutput['car']['cars']['cars'][number] | undefined;
  onClose: () => void;
}

const DeleteCar = graphql(`
  mutation DeleteCar($id: String!, $notification: String) {
    deleteCar(id: $id, notification: $notification)
  }
`);

export function DeleteCarDialog(props: Props) {
  const { isOpen, onClose, car } = props;
  const cancelRef = React.useRef(null);
  const toast = useToast();
  const utils = trpc.useUtils();

  const [deleteCar, { loading, error }] = useMutation(DeleteCar);
  const [notification, setNotification] = useState("");

  const doDelete = () => {
    deleteCar({ variables: { id: car?.id ?? "", notification } }).then(() => {
      toast({ title: 'Successfully deleted car', status: 'success' });
      onClose()
      utils.car.cars.invalidate();
    });
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete {car?.user.first}'s {car?.make} {car?.model}?
          </AlertDialogHeader>
          <AlertDialogBody>
            {error && <Error error={error} />}
            <FormControl>
              <FormLabel>Notification</FormLabel>
              <Textarea
                onChange={(e) => setNotification(e.target.value)}
                value={notification}
              />
              <FormHelperText>Type a message here if you want the user to recieve a notification about why their car was removed</FormHelperText>
            </FormControl>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button isLoading={loading} colorScheme="red" onClick={doDelete} ml={3}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
