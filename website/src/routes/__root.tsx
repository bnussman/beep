import React, { useEffect } from "react";
import * as Sentry from '@sentry/react';
import { Stack, Box, CircularProgress, Container, ThemeProvider, CssBaseline } from "@mui/material";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";
import { useQueryClient } from "@tanstack/react-query";
import { queryClient, trpcClient, TRPCProvider, useTRPC } from '../utils/trpc';
import { Header } from '../components/Header';
import { Banners } from '../components/Banners';
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { theme } from "../utils/theme";
import { NotificationsProvider } from "@toolpad/core/useNotifications";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import poppinsNormal from '@fontsource/poppins/400?url'
import poppinsBold from '@fontsource/poppins/700?url'

export const Route = createRootRoute({
  head: () => ({
    links: [
      { rel: 'stylesheet', href: poppinsNormal },
      { rel: 'stylesheet', href: poppinsBold }
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

// function Providers({ children }: { children: React.ReactNode }) {
//   const emotionCache = createCache({ key: 'css' })

//   return (
//     <CacheProvider value={emotionCache}>
//       <ThemeProvider theme={theme}>
//         <CssBaseline />
//         {children}
//       </ThemeProvider>
//     </CacheProvider>
//   )
// }

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <Providers>
          <Header />

          <Container component="main" sx={{ paddingBlock: 4 }}>
            {children}
          </Container>
        </Providers>

        <Scripts />
      </body>
    </html>
  )
}

// function RootComponent() {
//   return (
//     <Providers>
//       <RootDocument>
//         <Outlet />
//       </RootDocument>
//     </Providers>
//   )
// }

function Providers({ children }: { children: React.ReactNode }) {
  const emotionCache = createCache({ key: 'css' })

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <NotificationsProvider slotProps={{ snackbar: { autoHideDuration: 5_000 } }}>
          <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
              <CssBaseline enableColorScheme />
              {children}
              <ReactQueryDevtools />
              <TanStackRouterDevtools />
            </QueryClientProvider>
          </TRPCProvider>
        </NotificationsProvider>
      </ThemeProvider>
    </CacheProvider>
  )
}

// function RootDocument({ children }: { children: React.ReactNode }) {
//   const trpc = useTRPC();
//   const queryClient = useQueryClient();

//   const { data: user, isLoading } = useQuery(
//     trpc.user.me.queryOptions(undefined, {
//       retry: false,
//       refetchOnWindowFocus: false,
//     }),
//   );

//   useSubscription(
//     trpc.user.updates.subscriptionOptions(undefined, {
//       enabled: user !== undefined,
//       onData(user) {
//         queryClient.setQueryData(trpc.user.me.queryKey(), user);
//       },
//     }),
//   );

//   useEffect(() => {
//     if (user) {
//       Sentry.setUser(user);
//     }
//   }, [user]);

//   if (isLoading) {
//     return (
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         height="100vh"
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <html>
//       <head>
//         <HeadContent />
//       </head>
//       <body>
//         <Header />
//         <Container component="main" sx={{ pt: 10 }}>
//           <Stack spacing={2}>
//             <Banners />
//             {children}
//           </Stack>
//         </Container>
//         <Scripts />
//       </body>
//     </html>
//   );
// }
