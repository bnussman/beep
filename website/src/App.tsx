import React from "react";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/700.css";
import { theme } from "./utils/theme";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./utils/router";
import { trpc, queryClient, trpcClient } from "./utils/trpc";
import { QueryClientProvider } from "@tanstack/react-query";
import { THEME_ID, ThemeProvider } from "@mui/material/styles";
import { NotificationsProvider } from "@toolpad/core";
import CssBaseline from "@mui/material/CssBaseline";

export function App() {
  return (
    <ThemeProvider theme={{ [THEME_ID]: theme }}>
      <NotificationsProvider slotProps={{ snackbar: { autoHideDuration: 5_000 } } }>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <CssBaseline enableColorScheme />
            <RouterProvider router={router} />
          </QueryClientProvider>
        </trpc.Provider>
      </NotificationsProvider>
    </ThemeProvider>
  );
}
