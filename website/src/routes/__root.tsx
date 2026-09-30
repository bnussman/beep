import React from "react";
import createCache from "@emotion/cache";
import faviconUrl from "../assets/favicon.png?url";
import fontUrl from "@fontsource/poppins/400.css?url";
import fontUrlBold from "@fontsource/poppins/700.css?url";
import { queryClient } from "../utils/tanstack-query";
import { Container, ThemeProvider, CssBaseline } from "@mui/material";
import { Header } from "../components/Header";
import { AdminNavigationProvider } from "../components/AdminNavigationContext";
import { Footer } from "../components/Footer";
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
  useRouterState,
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
  const isAdminRoute = useRouterState({
    select: (state) => state.location.pathname.startsWith("/admin"),
  });

  return (
    <RootDocument isAdminRoute={isAdminRoute}>
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

function RootDocument({
  children,
  isAdminRoute,
}: {
  children: React.ReactNode;
  isAdminRoute: boolean;
}) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: "100vh", gap: 16 }}>
        <Providers>
          <AdminNavigationProvider>
            <Header isAdminRoute={isAdminRoute} />
            <Container
              component="main"
              maxWidth={isAdminRoute ? false : undefined}
              disableGutters={isAdminRoute}
              sx={{
                display: "flex",
                pt: isAdminRoute ? { xs: 7, sm: 8 } : 10,
                px: isAdminRoute ? 0 : undefined,
                gap: 2,
                flexDirection: "column",
                flexGrow: 1,
              }}
            >
              <Banners />
              {children}
            </Container>
            <Footer />
          </AdminNavigationProvider>
        </Providers>
        <Scripts />
      </body>
    </html>
  );
}
