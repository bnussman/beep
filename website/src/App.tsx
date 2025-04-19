import React from "react";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/700.css";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./utils/theme";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./utils/router";
import { trpc, queryClient, trpcClient } from "./utils/trpc";
import { QueryClientProvider } from "@tanstack/react-query";
import { THEME_ID, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { NotificationsProvider } from "@toolpad/core";

export function App() {
  return (
    <ChakraProvider resetCSS>
      <ThemeProvider theme={{ [THEME_ID]: theme }}>
        <NotificationsProvider>
          <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
              <CssBaseline enableColorScheme />
              <RouterProvider router={router} />
            </QueryClientProvider>
          </trpc.Provider>
        </NotificationsProvider>
      </ThemeProvider>
    </ChakraProvider>
  );
}
