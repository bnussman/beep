import React from "react";
import { Alert, Button, toast } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { orpc } from "../utils/orpc";

export function Banners() {
  const { data: user } = useQuery(
    orpc.user.me.queryOptions({
      retry: false,
      enabled: false,
    })
  );

  const { mutate: resend, isPending } = useMutation(
    orpc.auth.resendVerification.mutationOptions({
      onSuccess() {
        toast.success("Successfully resent verification email.", { timeout: 5_000 });
      },
      onError(error) {
        toast.danger(error.message, { timeout: 5_000 });
      },
    })
  );

  if (!user || user.isEmailVerified) {
    return null;
  }

  return (
    <Alert status="warning" className="items-center">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>Please verify your email</Alert.Title>
      </Alert.Content>
      <Button isPending={isPending} onPress={() => resend()}>
        Resend
      </Button>
    </Alert>
  );
}
