import React from "react";
import { Link as RouterLink, createRoute, useNavigate } from "@tanstack/react-router";
import { rootRoute } from "../App";
import { useMutation, useQuery } from "@apollo/client";
import { Link, Button, Text, Stack, Heading, Alert, AlertIcon, useDisclosure, Box, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogCloseButton, AlertDialogBody, AlertDialogFooter, useToast } from "@chakra-ui/react";
import { graphql } from 'gql.tada';
import { Error } from "../components/Error";
import { client } from "../utils/Apollo";
import { UserQuery } from "../utils/user";

export const deleteAccountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/account/delete',
  component: DeleteAccount,
})

const DeleteAccountMutation = graphql(`
  mutation DeleteAccount {
    deleteAccount
  }
`);

function DeleteAccount() {
  const { data } = useQuery(UserQuery);
  const [deleteAccount, { loading, error }] = useMutation(DeleteAccountMutation);
  const cancelRef = React.useRef(null);
  const toast = useToast();
  const navigate  = useNavigate();

  const { isOpen, onClose, onOpen } = useDisclosure();

  const onDelete = async () => {
    await deleteAccount();
    toast({ title: "Account deleted.", variant: 'success' });
    client.resetStore();
    navigate({ to: '/' });
  };

  const user = data?.getUser;

  return (
    <Stack spacing={4}>
      <Heading>Delete Account</Heading>
      <Alert status='info'>
        <AlertIcon />
        When your account is deleted, we do not retain any of your data, although it may exist in backups.
      </Alert>
      {user ? (
        <Box>
          <Button colorScheme="red" onClick={onOpen}>Delete Account</Button>
        </Box>
      ) : (
        <>
          <Text>
            <Link as={RouterLink} color='blue.400' to="/login">Login</Link> to delete your account.
          </Text>
          <Text>
            If you are unable to login to your account and still want your account/data deleted, please contact{' '}
            <Link href="mailto:banks@ridebeep.app">banks@ridebeep.app</Link>.
          </Text>
        </>
      )}
      <AlertDialog
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Delete Account?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            {error && <Error error={error} />}
            Are you sure you want to delete your account and all of your Beep data?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='red' ml={3} isLoading={loading} onClick={onDelete}>
              Delete Account
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Stack>
  );
}
