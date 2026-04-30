import React from "react";
import { Box, Skeleton, Typography } from "@mui/material";
import { useTRPC } from "../utils/trpc";
import { useSubscription } from "@trpc/tanstack-react-query";

export function BeepsCount() {
  const trpc = useTRPC();

  const { data: count } = useSubscription(
    trpc.beep.beepsCountSubscription.subscriptionOptions(),
  );

  const isLoading = count === undefined;

  const sx = {
    display: "flex",
    flexDirection: "row",
    gap: 2,
    alignItems: "flex-end",
    marginTop: "90px !important",
  };

  const liveBadgeSx = {
    width: 10,
    height: 10,
    mb: 0.8,
    borderRadius: "50%",
    backgroundColor: "#34d399",
    position: "relative",
    boxShadow: "0 0 0 0 rgba(52,211,153, 0.7)",
    animation: `pulse 1500ms infinite`,
    "@keyframes pulse": {
      "0%": {
        boxShadow: "0 0 0 0 rgba(52,211,153, 0.7)",
      },
      "70%": {
        boxShadow: "0 0 0 10px rgba(52,211,153, 0)",
      },
      "100%": {
        boxShadow: "0 0 0 0 rgba(52,211,153, 0)",
      },
    },
  } as const;

  return (
    <Box sx={sx}>
      <Typography fontSize="2.5rem" minWidth="150px">
        {isLoading ? <Skeleton /> : count.toLocaleString()}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
        <Typography fontSize="1.125rem" sx={{ mb: 1 }}>
          beeps
        </Typography>
        <Box sx={liveBadgeSx} />
      </Box>
    </Box>
  );
}
