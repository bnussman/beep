import React from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Checkbox
} from "@chakra-ui/react";

interface Props {
  isOpen: boolean;
  isLoading: boolean;
  cancelRef: any;
  onClose: () => void;
  onSubmit: () => void;
  stopBeeping: boolean;
  setStopBeeping: (beeping: boolean) => void;
}

export function ClearQueueDialog(props: Props) {
  const {
    isOpen,
    onClose,
    cancelRef,
    isLoading,
    onSubmit,
    stopBeeping,
    setStopBeeping
  } = props;

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Clear user's queue?
          </AlertDialogHeader>

          <AlertDialogBody>
            <Checkbox isChecked={stopBeeping} onChange={() => setStopBeeping(!stopBeeping)}>Turn off user's Beeping status after clear?</Checkbox>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button isLoading={isLoading} colorScheme="blue" onClick={onSubmit} ml={3}>
              Clear Queue
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}