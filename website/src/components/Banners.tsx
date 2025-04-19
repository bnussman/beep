import React from "react";
import { trpc } from "../utils/trpc";
import { Alert, Button } from "@mui/material";
import { useNotifications } from "@toolpad/core";

export function Banners() {
  const { data: user } = trpc.user.me.useQuery(undefined, {
    retry: false,
    enabled: false,
  });

  const { mutate: resend, isPending } = trpc.auth.resendVerification.useMutation({
    onSuccess() {
      notifications.show("Successfully resent verification email.", {
        severity: "success",
      });
    },
    onError(error) {
      notifications.show(error.message, { severity: "error" });
    },
  });

  const notifications = useNotifications();

  if (!user || user.isEmailVerified) {
    return null;
  }

  return (
    <Alert
      severity="error"
      action={
        <Button
          loading={isPending}
          onClick={() => resend()}
          color="error"
          variant="outlined"
        >
          Resend
        </Button>
      }
    >
      Please verify your email
    </Alert>
  );
}
