import React, { useState } from 'react';
import { Error } from './Error';
import { gql, useMutation } from '@apollo/client';
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
  useToast
} from "@chakra-ui/react";
import { SendNotificationMutation } from '../generated/graphql';

const SendNotification = gql`
    mutation SendNotification($title: String!, $body: String!, $id: String!) {
      sendNotification(title: $title, body: $body, id: $id)
    }
`;


interface Props {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}

function SendNotificationDialog(props: Props) {
  const { isOpen, onClose, id } = props;
  const toast = useToast();

  const [title, setTitle] = useState<string>();
  const [body, setBody] = useState<string>();

  const [send, { loading, error }] = useMutation<SendNotificationMutation>(SendNotification);

  const onClick = async () => {
    await send({ variables: { title, body, id } });
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
          {error && <Error error={error} />}
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
            <Button variant='ghost' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              colorScheme='blue'
              isLoading={loading}
              onClick={onClick}
            >
              Send Notification
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
  );
}

export default SendNotificationDialog;
