import { AlertDialog, Button } from "@heroui/react";
import React from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function SendNotificationConfirmationDialog(props: Props) {
  const { open, onClose, onConfirm } = props;

  return (
    <AlertDialog.Backdrop
      isOpen={open}
      onOpenChange={(isOpen) => !isOpen && onClose()}
    >
      <AlertDialog.Container>
        <AlertDialog.Dialog>
          <AlertDialog.Header>
            <AlertDialog.Heading>Send notification?</AlertDialog.Heading>
            <AlertDialog.CloseTrigger aria-label="Close" />
          </AlertDialog.Header>
          <AlertDialog.Body>
            Are you sure you want to send this notification?
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button variant="tertiary" onPress={onClose}>Cancel</Button>
            <Button onPress={onConfirm}>Send</Button>
          </AlertDialog.Footer>
        </AlertDialog.Dialog>
      </AlertDialog.Container>
    </AlertDialog.Backdrop>
  );
}
