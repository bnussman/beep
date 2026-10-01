import React, { useState } from "react";
import { orpc } from "../../utils/orpc";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useNotifications } from "@toolpad/core";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loading } from "../../components/Loading";
import { Alert, AlertDialog, Button, Typography, useOverlayState } from "@heroui/react";
import { Link } from "../../components/Link";

export const Route = createFileRoute('/account/delete')({
  component: DeleteAccount,
});

function DeleteAccount() {
  const queryClient = useQueryClient();
  const notifications = useNotifications();
  const navigate = useNavigate();
  const dialog = useOverlayState();

  const { data: user, isPending } = useQuery(
    orpc.user.me.queryOptions({ retry: false })
  );

  const {
    mutate: deleteAccount,
    isPending: isDeletePending,
    error: deleteError,
    reset,
  } = useMutation(
    orpc.user.deleteMyAccount.mutationOptions({
      onSuccess() {
        notifications.show("Account deleted.", { severity: "success" });
        localStorage.removeItem("user");
        queryClient.resetQueries();
        navigate({ to: "/" });
      },
    })
  );

  const onDelete = () => {
    deleteAccount();
  };

  const onCancel = () => {
    dialog.close();
    reset();
  };

  if (isPending) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-4">
      <Typography type="h1">Delete Account</Typography>
      <Alert status="accent">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>Notice</Alert.Title>
          <Alert.Description>
            When your account is deleted, we try not retain any of your data.
            It may exist in our database backups for some amount of time.
          </Alert.Description>
        </Alert.Content>
      </Alert>
      {user ? (
        <div>
          <Button variant="danger" onClick={() => dialog.open()}>
            Delete Account
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <Typography>
            <Link to="/login">Login</Link> to delete your account.
          </Typography>
          <Typography>
            If you are unable to login to your account and still want your
            account/data deleted, please contact{" "}
            <Link to={"mailto:banks@ridebeep.app" as string}>banks@ridebeep.app</Link>.
          </Typography>
        </div>
      )}
      <AlertDialog.Backdrop isKeyboardDismissDisabled={false} isOpen={dialog.isOpen} onOpenChange={dialog.setOpen}>
        <AlertDialog.Container>
          <AlertDialog.Dialog>
            <AlertDialog.Header>
              <AlertDialog.Heading>Delete Account?</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body className="flex flex-col gap-4">
              {deleteError && (
                <Alert status="danger">
                  <Alert.Indicator />
                  <Alert.Content>
                    <Alert.Title>Error</Alert.Title>
                    <Alert.Description>
                      {deleteError.message}
                    </Alert.Description>
                  </Alert.Content>
                </Alert>
              )}
              <p>
                Are you sure you want to delete your account and all of your Beep
                data?
              </p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button variant="tertiary" onClick={onCancel}>
                Nevermind
              </Button>
              <Button variant="danger" isPending={isDeletePending} onClick={onDelete}>
                Delete Account
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </div>
  );
}
