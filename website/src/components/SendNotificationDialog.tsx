import React, { useState } from "react";
import { trpc } from "../utils/trpc";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { Alert } from "@mui/material";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}

export function SendNotificationDialog(props: Props) {
  const { isOpen, onClose, id } = props;
  const toast = useToast();

  const [title, setTitle] = useState<string>();
  const [body, setBody] = useState<string>();

  const {
    mutateAsync: sendNotification,
    isPending,
    error,
  } = trpc.notification.sendNotificationToUser.useMutation();

  const onClick = async () => {
    await sendNotification({
      userId: id,
      title: title ?? "",
      body: body ?? "",
    });
    toast({ title: "Successfully sent notification!", status: "success" });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Send Notification</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {error && <Alert severity="error">{error.message}</Alert>}
          <FormControl mb={2}>
            <FormLabel>Title</FormLabel>
            <Input
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Body</FormLabel>
            <Textarea
              name="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button colorScheme="blue" isLoading={isPending} onClick={onClick}>
            Send Notification
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
