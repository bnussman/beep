import React from "react";
import { useEffect } from "react";
import { Loading } from "../components/Loading";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../utils/root";
import { useTRPC } from "../utils/trpc";
import { Box, Alert } from "@mui/material";

import { useMutation } from "@tanstack/react-query";

export const verifyAccountRoute = createRoute({
  component: VerifyAccount,
  path: "/account/verify/$id",
  getParentRoute: () => rootRoute,
});

export function VerifyAccount() {
  const trpc = useTRPC();
  const { id } = verifyAccountRoute.useParams();

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
