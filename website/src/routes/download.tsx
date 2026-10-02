import React, { useEffect } from "react";
import { getDownloadLink } from "../utils/utils";
import { createFileRoute } from "@tanstack/react-router";
import { Typography, Spinner } from "@heroui/react";

export const Route = createFileRoute('/download')({
  component: Download,
});

function Download() {
  useEffect(() => {
    window.location.href = getDownloadLink();
  }, []);

  return (
    <div className="flex h-[200px] flex-col items-center justify-center gap-4">
      <Typography type="h2">
        Redirecting you to download
      </Typography>
      <Spinner size="xl" />
    </div>
  );
}
