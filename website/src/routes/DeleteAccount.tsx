import React, { useState } from "react";
import {
  Link as RouterLink,
  createRoute,
  useNavigate,
} from "@tanstack/react-router";
import { queryClient, trpc } from "../utils/trpc";
import { rootRoute } from "../utils/root";
import {
  Link,
  Alert,
  Typography,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import { useToast } from "@chakra-ui/react";

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

  const toast = useToast();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const onDelete = async () => {
    await deleteAccount();
    toast({ title: "Account deleted.", variant: "success" });
    localStorage.removeItem("user");
    queryClient.resetQueries();
    navigate({ to: "/" });
  };

  return (
    <Stack spacing={2}>
      <Typography>Delete Account</Typography>
      <Alert severity="info">
        When your account is deleted, we do not retain any of your data,
        although it may exist in backups.
      </Alert>
      {user ? (
        <Box>
          <Button color="error" onClick={() => setIsOpen(true)}>
            Delete Account
          </Button>
        </Box>
      ) : (
        <>
          <Typography>
            <Link component={RouterLink} to="/login">
              Login
            </Link>{" "}
            to delete your account.
          </Typography>
          <Typography>
            If you are unable to login to your account and still want your
            account/data deleted, please contact{" "}
            <Link href="mailto:banks@ridebeep.app">banks@ridebeep.app</Link>.
          </Typography>
        </>
      )}
      <Dialog onClose={() => setIsOpen(false)} open={isOpen}>
        <DialogTitle>Delete Account?</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error">{error.message}</Alert>}
          Are you sure you want to delete your account and all of your Beep
          data?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button color="error" loading={isPending} onClick={onDelete}>
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
