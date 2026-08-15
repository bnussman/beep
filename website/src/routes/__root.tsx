import React from "react";
import createCache from "@emotion/cache";
import faviconUrl from "../assets/favicon.png?url";
import fontUrl from "@fontsource/poppins/400.css?url";
import fontUrlBold from "@fontsource/poppins/700.css?url";
import { queryClient } from "../utils/tanstack-query";
import { Container, ThemeProvider, CssBaseline } from "@mui/material";
import { Header } from "../components/Header";
import { Banners } from "../components/Banners";
import { CacheProvider } from "@emotion/react";
import { theme } from "../utils/theme";
import { NotificationsProvider } from "@toolpad/core";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";

export const Route = createRootRoute({
  head: () => ({
    links: [
      { rel: "icon", href: faviconUrl },
      { rel: "preload", href: fontUrl, as: "style" },
      { rel: "preload", href: fontUrlBold, as: "style" },
      { rel: "stylesheet", href: fontUrl },
      { rel: "stylesheet", href: fontUrlBold },
    ],
    meta: [
      { title: "Ride Beep App" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0",
      },
      {
        name: "apple-itunes-app",
        content: "app-id=1528601773",
      },
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
          <QueryClientProvider client={queryClient}>
            <CssBaseline enableColorScheme />
            {children}
          </QueryClientProvider>
        </NotificationsProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Providers>
          <Header />

          <Container component="main" sx={{ display: 'flex', pt: 10, gap: 2, flexDirection: 'column' }}>
            <Banners />
            {children}
          </Container>
        </Providers>
        <Scripts />
      </body>
    </html>
  );
}
