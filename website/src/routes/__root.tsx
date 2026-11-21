import React from "react";
import stylesUrl from '../styles.css?url'
import faviconUrl from "../assets/favicon.png?url";
import fontUrl from "@fontsource/poppins/400.css?url";
import fontUrlBold from "@fontsource/poppins/700.css?url";
import { ThemeProvider } from 'tanstack-theme-kit'
import { queryClient } from "../utils/tanstack-query";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Banners } from "../components/Banners";
import { Toast } from "@heroui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";

const themeScript = `(function() {
  try {
    const theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();`

export const Route = createRootRoute({
  scripts: () => [
    { children: themeScript, "data-cfasync": "false" }
  ],
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
  component: RootDocument,
});

function RootDocument() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-background">
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <Header />
            <Toast.Provider />
            <main className="flex flex-col gap-4 min-h-screen max-w-7xl mx-auto pb-4 pt-20 px-4">
              <Banners />
              <Outlet />
            </main>
            <Footer />
          </QueryClientProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html >
  );
}
