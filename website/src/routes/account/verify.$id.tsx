import React from "react";
import { useEffect } from "react";
import { Loading } from "../../components/Loading";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { orpc } from "../../utils/orpc";
import { Alert } from "@heroui/react";

export const Route = createFileRoute('/account/verify/$id')({
  component: VerifyAccount,
});

function VerifyAccount() {
  const { id } = Route.useParams();

  const {
    mutate: verifyEmail,
    data,
    isPending,
    error,
  } = useMutation(orpc.auth.verifyAccount.mutationOptions());

  useEffect(() => {
    verifyEmail({ id });
  }, []);

  if (isPending) return <Loading />;

  if (error) {
    return (
      <Alert status="danger">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>Verification Failed</Alert.Title>
          <Alert.Description>
            {error.message}
          </Alert.Description>
        </Alert.Content>
      </Alert>
    );
  }

  if (data) {
    return (
      <Alert status="success">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>Successfully verified email</Alert.Title>
          <Alert.Description>
            Your email has been successfully verified.
          </Alert.Description>
        </Alert.Content>
      </Alert>
    );
  }

  return null;
}
