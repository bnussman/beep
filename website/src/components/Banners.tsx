import React from "react";
import { trpc } from "../utils/trpc";
import { Alert, Button } from "@mui/material";
import { useToast } from "@chakra-ui/react";

export function Banners() {
  const { data: user } = trpc.user.me.useQuery(undefined, {
    retry: false,
    enabled: false,
  });

  const { mutateAsync: resendVerifyEmail, isPending } =
    trpc.auth.resendVerification.useMutation();

  const toast = useToast();

  async function resendVarificationEmail() {
    try {
      await resendVerifyEmail();
      toast({
        status: "success",
        title: "Success",
        description: "Successfully resent verification email.",
      });
    } catch (error: any) {
      toast({
        status: "error",
        title: "Error",
        description: error.message,
      });
    }
  }

  if (!user || user.isEmailVerified) {
    return null;
  }

  return (
    <Alert
      severity="error"
      action={
        <Button
          loading={isPending}
          onClick={resendVarificationEmail}
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
