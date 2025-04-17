import React, { useState } from "react";
import { EditDetails } from "./EditDetails";
import { EditLocation } from "./EditLocation";
import { createRoute } from "@tanstack/react-router";
import { userRoute } from "../User";
import { trpc } from "../../../../utils/trpc";
import {
  Alert,
  Box,
  CircularProgress,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

export const editUserRoute = createRoute({
  component: Edit,
  path: "edit",
  getParentRoute: () => userRoute,
});

export function Edit() {
  const { userId } = editUserRoute.useParams();

  const { data: user, isLoading, error } = trpc.user.user.useQuery(userId);

  const [index, setIndex] = useState(0);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <Stack>
      <Typography variant="h4" fontWeight="bold">
        Edit
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={index} onChange={(e, index) => setIndex(index)}>
          <Tab label="Details" />
          <Tab label="Location" />
        </Tabs>
      </Box>
      <Box sx={{ mt: 2 }}>
        {index === 0 && <EditDetails />}
        {index === 1 && <EditLocation />}
      </Box>
    </Stack>
  );
}
