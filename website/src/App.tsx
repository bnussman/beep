import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/700.css";
import { theme } from "./utils/theme";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./utils/router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material/styles";
import { NotificationsProvider } from "@toolpad/core";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from "./utils/tanstack-query";

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <NotificationsProvider slotProps={{ snackbar: { autoHideDuration: 5_000 } }}>
        <QueryClientProvider client={queryClient}>
          <CssBaseline enableColorScheme />
          <RouterProvider router={router} />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </NotificationsProvider>
    </ThemeProvider>
  );
}
