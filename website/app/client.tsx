import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { createRouter } from "./router";
import '../src/utils/instrument';
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/700.css";
import { theme } from "../src/utils/theme";
import { queryClient, trpcClient, TRPCProvider } from "../src/utils/trpc";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material/styles";
import { NotificationsProvider } from "@toolpad/core";
import CssBaseline from "@mui/material/CssBaseline";
import "maplibre-gl/dist/maplibre-gl.css";

const router = createRouter();

const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
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
