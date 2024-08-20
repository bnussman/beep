import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { EmailIcon } from "@chakra-ui/icons";
import { useMutation } from "@apollo/client";
import { Error } from '../../../components/Error';
import { useValidationErrors } from "../../../utils/useValidationErrors";
import { createRoute } from "@tanstack/react-router";
import { adminRoute } from "..";
import { VariablesOf, graphql } from "gql.tada";
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
import { RouterInput, trpc } from "../../../utils/trpc";

type SendNotifictionVariables = RouterInput['notification']['sendNotification'];

export const notificationsRoute = createRoute({
  component: Notifications,
  path: "/notifications",
  getParentRoute: () => adminRoute,
});

export function Notifications() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const cancelRef = useRef<any>();
  const toast = useToast();

  const {
    mutateAsync: sendNotification,
    error,
    isPending
  } = trpc.notification.sendNotification.useMutation();

  const {
    handleSubmit,
    register,
    watch,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SendNotifictionVariables>({ mode: 'onChange' });

  const validationErrors = error?.data?.zodError?.fieldErrors;

  const emailMatch = watch('emailMatch');

  const onSubmit = handleSubmit((variables) => {
    sendNotification(variables).then((numberOfNotificationsSend) => {
      onClose();
      toast({ title: `Sent notification to ${numberOfNotificationsSend} users.`})
      reset();
    });
  });

  return (
    <>
      <Stack spacing={4}>
        <Heading>Notifications</Heading>
        {error && <Error>{error.message}</Error>}
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
        <FormControl isInvalid={Boolean(errors.emailMatch) || Boolean(validationErrors?.emailMatch)}>
          <FormLabel>Match</FormLabel>
          <Input
            placeholder="%@appstate.edu"
            {...register('emailMatch')}
          />
          <FormHelperText>Leave this empty to send to all Beep App users.</FormHelperText>
          <FormErrorMessage>
            {errors.emailMatch && errors.emailMatch.message}
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
        isLoading={isSubmitting || isPending}
      >
        Send
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
              Are you sure? {emailMatch ? <>This will be sent to all user having an email that matches <Code>{emailMatch}</Code></> : 'This will be sent to all Beep App users.'}
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
