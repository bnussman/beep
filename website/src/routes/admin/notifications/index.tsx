import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { EmailIcon } from "@chakra-ui/icons";
import { useMutation } from "@apollo/client";
import { Error } from '../../../components/Error';
import { useValidationErrors } from "../../../utils/useValidationErrors";
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
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Stack,
  Textarea,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { createRoute } from "@tanstack/react-router";
import { adminRoute } from "..";
import { VariablesOf, graphql } from "gql.tada";

const SendNotifications = graphql(`
    mutation SendNotifications($title: String!, $body: String!, $match: String) {
      sendNotifications(title: $title, body: $body, match: $match)
    }
`);

type SendNotifictionVariables = VariablesOf<typeof SendNotifications>;

const CleanObjectStorageBucket = graphql(`
  mutation CleanObjectStorageBucket {
    cleanObjectStorageBucket
  }
`);

export const notificationsRoute = createRoute({
  component: Notifications,
  path: "/notifications",
  getParentRoute: () => adminRoute,
});

export function Notifications() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const cancelRef = useRef<any>();
  const toast = useToast();

  const [send, { error, loading: notificationLoading }] = useMutation(SendNotifications);
  const [clean, { loading }] = useMutation(CleanObjectStorageBucket);

  const {
    handleSubmit,
    register,
    watch,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SendNotifictionVariables>({ mode: 'onChange' });

  const validationErrors = useValidationErrors<SendNotifictionVariables>(error);

  const match = watch('match');

  const onSubmit = handleSubmit((variables) => {
    onClose();
    send({ variables }).then(({ data }) => {
      toast({ title: `Sent notification to ${data?.sendNotifications} users.`})
      reset();
    });
  });

  const onClean = () => {
    clean()
      .then(({ data }) => {
        toast({ status: 'success', description: `Cleaned ${data?.cleanObjectStorageBucket} objects` });
      })
      .catch((error) => {
        toast({ status: 'error', description: error.message });
      });
  }

  return (
    <>
      <Stack spacing={4}>
        <Heading>Notifications</Heading>
        {error && !validationErrors ? <Error error={error} /> : null}
        <FormControl isInvalid={Boolean(errors.title) || Boolean(validationErrors?.title)}>
          <FormLabel>Title</FormLabel>
          <Input
            {...register('title', {
              required: 'This is required',
            })}
          />
          <FormErrorMessage>
            {errors.title && errors.title.message}
            {validationErrors?.title && validationErrors?.title[0]}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={Boolean(errors.match) || Boolean(validationErrors?.match)}>
          <FormLabel>Match</FormLabel>
          <Input
            placeholder="%@appstate.edu"
            {...register('match')}
          />
          <FormHelperText>Leave this empty to send to all Beep App users.</FormHelperText>
          <FormErrorMessage>
            {errors.match && errors.match.message}
            {validationErrors?.match && validationErrors?.match[0]}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={Boolean(errors.body) || Boolean(validationErrors?.body)}>
          <FormLabel>Body</FormLabel>
          <Textarea
            {...register('body', {
              required: 'This is required',
            })}
          />
          <FormErrorMessage>
            {errors.body && errors.body.message}
            {validationErrors?.body && validationErrors?.body[0]}
          </FormErrorMessage>
        </FormControl>
      </Stack>
      <Button
        mt={4}
        colorScheme="purple"
        onClick={onOpen}
        rightIcon={<EmailIcon />}
        isDisabled={!isValid}
        isLoading={isSubmitting || notificationLoading}
      >
        Send
      </Button>
      {/* <Button
        colorScheme="red"
        onClick={onClean}
        isLoading={loading}
        mt={4}
      >
        Clean Object Bucket
      </Button> */}
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
              Are you sure? {match ? <>This will be sent to all user having an email that matches <Code>{match}</Code></> : 'This will be sent to all Beep App users.'}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                ml={3}
                colorScheme="blue"
                type="submit"
                onClick={onSubmit}
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
