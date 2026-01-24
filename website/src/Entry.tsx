import React from "react";
import { Stack, Box, CircularProgress, Container } from "@mui/material";
import { Header } from "./components/Header";
import { Banners } from "./components/Banners";
import { Outlet } from "@tanstack/react-router";
import { useUser } from "./utils/orpc";

export function Entry() {
  const { isLoading } = useUser();

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
