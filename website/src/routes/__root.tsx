import React from "react";
import stylesUrl from '../styles.css?url'
import faviconUrl from "../assets/favicon.png?url";
import fontUrl from "@fontsource/poppins/400.css?url";
import fontUrlBold from "@fontsource/poppins/700.css?url";
import { ThemeProvider as TanstackThemeProvider } from 'tanstack-theme-kit'
import { queryClient } from "../utils/tanstack-query";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Banners } from "../components/Banners";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { Toast } from "@heroui/react";

export const Route = createRootRoute({
  head: () => ({
    links: [
      { rel: "icon", href: faviconUrl },
      { rel: "preload", href: fontUrl, as: "style" },
      { rel: "preload", href: fontUrlBold, as: "style" },
      { rel: 'stylesheet', href: stylesUrl },
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
  return (
    <TanstackThemeProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </TanstackThemeProvider>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-screen flex-col gap-4 bg-background">
        <Providers>
          <Header />
          <Toast.Provider />
          <main className="mx-auto flex w-full max-w-320 flex-1 flex-col gap-4 px-6 pt-20">
            <Banners />
            {children}
          </main>
          <Footer />
        </Providers>
        <Scripts />
      </body>
    </html>
  );
}
