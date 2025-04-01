import React from 'react';
import { Box, CircularProgress, Container } from "@mui/material";
import { trpc } from "./utils/trpc";
import { Header } from "./components/Header";
import { Banners } from "./components/Banners";
import { Outlet } from "@tanstack/react-router";

export function Entry() {
  const { data: user, isPending } = trpc.user.me.useQuery(undefined, {
    retry: false,
  });
  const utils = trpc.useUtils();

  trpc.user.updates.useSubscription(undefined, {
    enabled: user !== undefined,
    onData(user) {
      utils.user.me.setData(undefined, user);
    }
  })

  if (isPending) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Header />
      <Container component="main" sx={{ pt: 10 }}>
        <Banners />
        <Outlet />
      </Container>
    </>
  );
}
