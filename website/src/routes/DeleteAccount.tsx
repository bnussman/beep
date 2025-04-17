import React from "react";
import {
  Link as RouterLink,
  createRoute,
  useNavigate,
} from "@tanstack/react-router";
import {
  Link,
  Button,
  Text,
  Stack,
  Heading,
  useDisclosure,
  Box,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  useToast,
} from "@chakra-ui/react";
import { queryClient, trpc } from "../utils/trpc";
import { rootRoute } from "../utils/root";
import { Alert } from "@mui/material";

export const deleteAccountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/account/delete",
  component: DeleteAccount,
});

function DeleteAccount() {
  const { data: user } = trpc.user.me.useQuery(undefined, { enabled: false });
  const {
    mutateAsync: deleteAccount,
    isPending,
    error,
  } = trpc.user.deleteMyAccount.useMutation();

  const cancelRef = React.useRef(null);
  const toast = useToast();
  const navigate = useNavigate();

  const { isOpen, onClose, onOpen } = useDisclosure();

  const onDelete = async () => {
    await deleteAccount();
    toast({ title: "Account deleted.", variant: "success" });
    localStorage.removeItem("user");
    queryClient.resetQueries();
    navigate({ to: "/" });
  };

  return (
    <Stack spacing={4}>
      <Heading>Delete Account</Heading>
      <Alert severity="info">
        When your account is deleted, we do not retain any of your data,
        although it may exist in backups.
      </Alert>
      {user ? (
        <Box>
          <Button colorScheme="red" onClick={onOpen}>
            Delete Account
          </Button>
        </Box>
      ) : (
        <>
          <Text>
            <Link as={RouterLink} color="blue.400" to="/login">
              Login
            </Link>{" "}
            to delete your account.
          </Text>
          <Text>
            If you are unable to login to your account and still want your
            account/data deleted, please contact{" "}
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
            {error && <Alert severity="error">{error.message}</Alert>}
            Are you sure you want to delete your account and all of your Beep
            data?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              ml={3}
              isLoading={isPending}
              onClick={onDelete}
            >
              Delete Account
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Stack>
  );
}
