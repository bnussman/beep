import React from "react";
import { Alert, Button } from "@mui/material";
import { useNotifications } from "@toolpad/core";

import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { orpc } from "../utils/trpc";

export function Banners() {
  const { data: user } = useQuery(orpc.user.me.queryOptions({
    retry: false,
    enabled: false,
  }));

  const { mutate: resend, isPending } = useMutation(orpc.auth.resendVerification.mutationOptions({
    onSuccess() {
      notifications.show("Successfully resent verification email.", {
        severity: "success",
      });
    },
    onError(error) {
      notifications.show(error.message, { severity: "error" });
    },
  }));

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
          onClick={() => resend({})}
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
