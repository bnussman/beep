import React from "react";
import { Stack, Box, CircularProgress, Container } from "@mui/material";
import { Header } from "./components/Header";
import { Banners } from "./components/Banners";
import { Outlet } from "@tanstack/react-router";

import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { orpc } from "./utils/trpc";

export function Entry() {
  const { data: user, isLoading } = useQuery(
    orpc.user.me.queryOptions({
      retry: false,
      refetchOnWindowFocus: false,
    }),
  );
  const queryClient = useQueryClient();

  // useSubscription(
  //   trpc.user.updates.subscriptionOptions(undefined, {
  //     enabled: user !== undefined,
  //     onData(user) {
  //       queryClient.setQueryData(trpc.user.me.queryKey(), user);
  //     },
  //   }),
  // );

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
