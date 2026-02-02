import React from "react";
import { Stack, Box, CircularProgress, Container } from "@mui/material";
import { Header } from "./components/Header";
import { Banners } from "./components/Banners";
import { Outlet } from "@tanstack/react-router";
import { orpc } from "./utils/orpc";
import { useQuery } from "@tanstack/react-query";

export function Entry() {
  const { isLoading } = useQuery(
    orpc.user.updates.experimental_liveOptions({
      retry(failureCount, error) {
        return error.message !== "Unauthorized";
      },
      refetchOnWindowFocus: false,
    })
  );

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
