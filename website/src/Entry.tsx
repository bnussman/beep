import React from "react";
import { Stack, Box, CircularProgress, Container } from "@mui/material";
import { useTRPC } from "./utils/trpc";
import { Header } from "./components/Header";
import { Banners } from "./components/Banners";
import { Outlet } from "@tanstack/react-router";

import { useQuery } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";
import { useQueryClient } from "@tanstack/react-query";

export function Entry() {
  const trpc = useTRPC();
  const { data: user, isPending } = useQuery(trpc.user.me.queryOptions(undefined, {
    retry: false,
  }));
  const queryClient = useQueryClient();

  useSubscription(trpc.user.updates.subscriptionOptions(undefined, {
    enabled: user !== undefined,
    onData(user) {
      queryClient.setQueryData(trpc.user.me.queryKey(), user);
    },
  }));

  if (isPending) {
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
