import React from 'react';
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/700.css";
import { Center, ChakraProvider, Container, Spinner } from "@chakra-ui/react"
import { theme, muiTheme } from './utils/theme';
import { Header } from './components/Header';
import { Banners } from './components/Banners';
import { Outlet, RouterProvider } from '@tanstack/react-router';
import { router } from './utils/router';
import { trpc, queryClient, trpcClient } from './utils/trpc';
import { QueryClientProvider } from '@tanstack/react-query';
import { THEME_ID, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

export function Beep() {
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
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <>
      <Header />
      <Container as="main" maxW="container.xl" pt={20}>
        <Banners />
        <Outlet />
      </Container>
    </>
  );
}

export function App() {
  return (
    <ChakraProvider theme={theme}>
      <ThemeProvider theme={{ [THEME_ID]: muiTheme }}>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <CssBaseline enableColorScheme />
            <RouterProvider router={router} />
          </QueryClientProvider>
        </trpc.Provider>
      </ThemeProvider>
    </ChakraProvider>
  );
}
