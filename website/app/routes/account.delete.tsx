import React, { useState } from "react";
import { useNotifications } from "@toolpad/core";
import { queryClient, useTRPC } from "../../src/utils/trpc";
import {
  Link as RouterLink,
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";
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

import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

export const Route = createFileRoute("/account/delete")({
  component: DeleteAccount,
});

function DeleteAccount() {
  const trpc = useTRPC();
  const { data: user } = useQuery(trpc.user.me.queryOptions(undefined, { enabled: false }));
  const {
    mutateAsync: deleteAccount,
    isPending,
    error,
  } = useMutation(trpc.user.deleteMyAccount.mutationOptions());

  const notifications = useNotifications();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const onDelete = async () => {
    await deleteAccount();
    notifications.show("Account deleted.", { severity: "success" });
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
