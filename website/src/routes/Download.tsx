import React, { useEffect } from "react";
import { getDownloadLink } from "../utils/utils";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../utils/root";
import { CircularProgress, Typography, Stack } from "@mui/material";

export const downloadRoute = createRoute({
  path: "/download",
  getParentRoute: () => rootRoute,
  component: Download,
});

export function Download() {
  useEffect(() => {
    window.location.href = getDownloadLink();
  }, []);

  return (
    <Stack
      spacing={2}
      height="200px"
      alignItems="center"
      justifyContent="center"
    >
      <Typography variant="h5" fontWeight="bold">
        Redirecting you to download
      </Typography>
      <CircularProgress />
    </Stack>
  );
}
