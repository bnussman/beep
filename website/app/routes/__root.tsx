import React, { useEffect } from "react";
import * as Sentry from '@sentry/react';
import { Stack, Box, CircularProgress, Container } from "@mui/material";
import { useTRPC } from "../../src/utils/trpc";
import { Header } from "../../src/components/Header";
import { Banners } from "../../src/components/Banners";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";
import { useQueryClient } from "@tanstack/react-query";

function RootComponent() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery(
    trpc.user.me.queryOptions(undefined, {
      retry: false,
      refetchOnWindowFocus: false,
    }),
  );

  useSubscription(
    trpc.user.updates.subscriptionOptions(undefined, {
      enabled: user !== undefined,
      onData(user) {
        queryClient.setQueryData(trpc.user.me.queryKey(), user);
      },
    }),
  );

  useEffect(() => {
    if (user) {
      Sentry.setUser(user);
    }
  }, [user]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Header />
      <Container component="main" sx={{ pt: 10 }}>
        <Stack spacing={2}>
          <Banners />
          <Outlet />
        </Stack>
      </Container>
    </>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
