import React from "react";
import createCache from "@emotion/cache";
import fontUrl from "@fontsource/poppins/400.css?url";
import fontUrlBold from "@fontsource/poppins/700.css?url";
import { Container, ThemeProvider, CssBaseline } from "@mui/material";
import { Header } from "../components/Header";
import { Banners } from "../components/Banners";
import { CacheProvider } from "@emotion/react";
import { theme } from "../utils/theme";
import { NotificationsProvider } from "@toolpad/core";
import { queryClient, trpcClient, TRPCProvider } from "../utils/trpc";
import { QueryClientProvider } from "@tanstack/react-query";
import { RootProvider } from "fumadocs-ui/provider/tanstack";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import styles from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    links: [
      { rel: "stylesheet", href: fontUrl },
      { rel: "stylesheet", href: fontUrlBold },
      { rel: "stylesheet", href: styles },
    ],
    meta: [
      { title: "Ride Beep App" },
      {
        name: "description",
        content:
          "A rideshare app for students. Ride or drive at your university today.",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function Providers({ children }: { children: React.ReactNode }) {
  const emotionCache = createCache({ key: "css" });

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <NotificationsProvider
          slotProps={{ snackbar: { autoHideDuration: 5_000 } }}
        >
          <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
              <RootProvider>
                <CssBaseline enableColorScheme />
                {children}
              </RootProvider>
            </QueryClientProvider>
          </TRPCProvider>
        </NotificationsProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <Providers>
          <Header />

          <Container component="main" sx={{ pt: 10 }}>
            <Banners />
            {children}
          </Container>
        </Providers>
        <Scripts />
      </body>
    </html>
  );
}

// function RootComponent() {
//   return (
//     <>
//       <Header />
//       <Container component="main" sx={{ pt: 10 }}>
//         <Banners />
//         <Outlet />
//       </Container>
//     </>
//   );
// }
