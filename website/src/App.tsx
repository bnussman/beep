import React from "react";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/700.css";
import { theme } from "./utils/theme";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./utils/router";
import { queryClient, trpcClient, TRPCProvider } from "./utils/trpc";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material/styles";
import { NotificationsProvider } from "@toolpad/core";
import CssBaseline from "@mui/material/CssBaseline";

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <NotificationsProvider
        slotProps={{ snackbar: { autoHideDuration: 5_000 } }}
      >
        <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <CssBaseline enableColorScheme />
            <RouterProvider router={router} />
          </QueryClientProvider>
        </TRPCProvider>
      </NotificationsProvider>
    </ThemeProvider>
  );
}
