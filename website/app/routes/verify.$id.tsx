import React from "react";
import { useEffect } from "react";
import { Loading } from "../../src/components/Loading";
import { createFileRoute } from "@tanstack/react-router";
import { useTRPC } from "../../src/utils/trpc";
import { Box, Alert } from "@mui/material";

import { useMutation } from "@tanstack/react-query";

export const Route = createFileRoute("/verify/$id")({
  component: VerifyAccount,
});

export function VerifyAccount() {
  const trpc = useTRPC();
  const { id } = Route.useParams();

  const {
    mutateAsync: verifyEmail,
    data,
    isPending,
    error,
  } = useMutation(trpc.auth.verifyAccount.mutationOptions());

  const handleVerify = async () => {
    try {
      await verifyEmail({ id });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleVerify();
  }, []);

  return (
    <Box>
      {isPending && <Loading />}
      {data && <Alert severity="success">Successfully verified email</Alert>}
      {error && <Alert severity="error">{error.message}</Alert>}
    </Box>
  );
}
