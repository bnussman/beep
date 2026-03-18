import React from "react";
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { Stack, Container } from "@mui/material";
import { Header } from '../components/Header';
import { Banners } from '../components/Banners';

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
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
