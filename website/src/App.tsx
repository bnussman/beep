import React from 'react';
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/700.css";
import { ChakraProvider } from "@chakra-ui/react"
import { theme, muiTheme } from './utils/theme';
import { Header } from './components/Header';
import { Banners } from './components/Banners';
import { Outlet, RouterProvider } from '@tanstack/react-router';
import { router } from './utils/router';
import { trpc, queryClient, trpcClient } from './utils/trpc';
import { QueryClientProvider } from '@tanstack/react-query';
import { THEME_ID, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';

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

export function App() {
  return (
    <ChakraProvider theme={theme} resetCSS>
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
