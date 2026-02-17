import React, { useEffect } from "react";
import { getDownloadLink } from "../../src/utils/utils";
import { createFileRoute } from "@tanstack/react-router";
import { CircularProgress, Typography, Stack } from "@mui/material";

export const Route = createFileRoute("/download")({
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
