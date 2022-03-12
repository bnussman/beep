import React, { useRef } from "react";
import { useFormik } from "formik";
import { EmailIcon } from "@chakra-ui/icons";
import { gql, useMutation } from "@apollo/client";
import { CleanObjectStorageBucketMutation, SendNotificationsMutation } from "../../../generated/graphql";
import { Error } from '../../../components/Error';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Code,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Stack,
  Textarea,
  useDisclosure,
  useToast
} from "@chakra-ui/react";

const SendNotifications = gql`
    mutation SendNotifications($title: String!, $body: String!, $match: String) {
      sendNotifications(title: $title, body: $body, match: $match)
    }
`;

const CleanObjectStorageBucket = gql`
  mutation CleanObjectStorageBucket {
    cleanObjectStorageBucket
  }
`;

function Notifications() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const cancelRef = useRef<any>();
  const toast = useToast();

  const [send, { error }] = useMutation<SendNotificationsMutation>(SendNotifications);
  const [clean, { loading }] = useMutation<CleanObjectStorageBucketMutation>(CleanObjectStorageBucket);

  const onSubmit = ({ title, body, match }: { title: string; body: string; match: string; }) => {
    send({
      variables: {
        title,
        body,
        match: match ? match : undefined
      }
    }).then(data => {
      toast({ title: `Sent notification to ${data.data?.sendNotifications} users.`})
      onClose();
    });
  };

  const onClean = () => {
    clean()
      .then(({ data }) => {
        toast({ status: 'success', description: `Cleaned ${data?.cleanObjectStorageBucket} objects` });
      })
      .catch((error) => {
        toast({ status: 'error', description: error.message });
      });
  }

  const formik = useFormik({
    initialValues: {
      title: '',
      body: '',
      match: '',
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
            onChange={formik.handleChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Match</FormLabel>
          <Input
            name="match"
            value={formik.values.match}
            onChange={formik.handleChange}
            placeholder="%@appstate.edu"
          />
          <FormHelperText>Leave this empty to send to all Beep App users.</FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>Body</FormLabel>
          <Textarea
            name="body"
            value={formik.values.body}
            onChange={formik.handleChange}
          />
        </FormControl>
      </Stack>
      <Button
        colorScheme="purple"
        onClick={onOpen}
        rightIcon={<EmailIcon />}
        mt={4}
      >
        Send
      </Button>
      <Button
        colorScheme="red"
        onClick={onClean}
        isLoading={loading}
        mt={4}
      >
        Clean Object Bucket
      </Button>
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
              Are you sure? {formik.values.match ? <>This will be sent to all user having an email that matches <Code>{formik.values.match}</Code></> : 'This will be sent to all Beep App users.'}
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