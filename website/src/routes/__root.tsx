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
  useLocation,
} from "@tanstack/react-router";
import { Toast } from "@heroui/react";

export const Route = createRootRoute({
  head: () => ({
    // Inline so the dark background paints before the external stylesheet loads.
    styles: [
      {
        children:
          "@media (prefers-color-scheme: dark){html:not(.light):not([data-theme=light]){background:oklch(12% 0.005 285.823);color-scheme:dark}}",
      },
    ],
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
  const pathname = useLocation({
    select: (location) => location.pathname,
  });
  const showFooter = pathname !== "/admin" && !pathname.startsWith("/admin/");

  return (
    <RootDocument showFooter={showFooter}>
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

function RootDocument({
  children,
  showFooter,
}: {
  children: React.ReactNode;
  showFooter: boolean;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-screen flex-col bg-background">
        <Providers>
          <div className="flex grow min-h-lvh pb-4">
            <Header />
            <Toast.Provider />
            <main className="mx-auto flex grow w-full max-w-7xl flex-1 flex-col gap-4 px-6 pt-20">
              <Banners />
              {children}
            </main>
          </div>
          <Footer />
        </Providers>
        <Scripts />
      </body>
    </html>
  );
}
