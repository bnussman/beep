import { Box, useColorScheme } from "@mui/material";
import React from "react";

export function BetterStackStatus()  {
  const { colorScheme } = useColorScheme();

  return (
    <Box sx={{ paddingTop: 0.5 }}>
      <iframe
        src={`https://status.ridebeep.app/badge?theme=${colorScheme}`}
        width="250"
        height="30"
        frameBorder="0"
        scrolling="no"
        style={{ colorScheme: "normal" }}
      />
    </Box>
  )
}