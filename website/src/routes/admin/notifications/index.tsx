import React, { useRef } from "react";
import { useFormik } from "formik";
import { EmailIcon } from "@chakra-ui/icons";
import { gql, useMutation } from "@apollo/client";
import { SendNotificationMutation } from "../../../generated/graphql";
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
  FormLabel,
  Heading,
  Input,
  Stack,
  Textarea,
  toast,
  useDisclosure,
  useToast
} from "@chakra-ui/react";

const SendNotification = gql`
    mutation SendNotification($title: String!, $body: String!) {
      sendNotification(title: $title, body: $body)
    }
`;

function Notifications() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const cancelRef = useRef<any>();
  const toast = useToast();

  const [send, { error }] = useMutation<SendNotificationMutation>(SendNotification);

  const onSubmit = (values: { title: string; body: string; }) => {
    send({ variables: values }).then(data => {
      toast({ title: `Sent notification to ${data.data?.sendNotification} users.`})
      onClose();
    });
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      body: '',
    },
    onSubmit
  });

  return (
    <>
      <Stack spacing={4}>
        <Heading>Notifications</Heading>
        {error && <Error error={error} />}
        <FormControl>
          <FormLabel>Title</FormLabel>
          <Input
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Body</FormLabel>
          <Textarea
            name="body"
            value={formik.values.body}
            onChange={formik.handleChange} />
        </FormControl>
        <Button onClick={onOpen} rightIcon={<EmailIcon />}>Send</Button>
      </Stack>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Send Notification
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? This will be sent to all Beep App users.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                type="submit"
                ml={3}
                onClick={() => formik.handleSubmit()}
              >
                Send
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default Notifications;