import React from "react";
import { Box, Skeleton, Typography } from "@mui/material";
import { useTRPC } from "../utils/trpc";
import { useSubscription } from "@trpc/tanstack-react-query";

export function BeepsCount() {
  const trpc = useTRPC();

  const { data: count } = useSubscription(
    trpc.beep.beepsCountSubscription.subscriptionOptions(),
  );

  // const count = 736537;

  const isLoading = count === undefined;

  const sx = {
    display: "flex",
    flexDirection: "row",
    gap: 2,
    alignItems: "flex-end",
    marginTop: "90px !important",
  };

  if (isLoading) {
    return (
      <Box sx={sx}>
        <Skeleton sx={{ height: "2.5rem", width: "72px" }} />
        <Skeleton sx={{ width: "72px" }} />
      </Box>
    );
  }

  return (
    <Box sx={sx}>
      <Typography fontSize="2.5rem" lineHeight="2.5rem" minWidth="72px">
        {count.toLocaleString()}
      </Typography>
      <Typography>beeps</Typography>
    </Box>
  );
}
