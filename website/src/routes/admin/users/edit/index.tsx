import React, { useState } from "react";
import { orpc } from "../../../../utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { EditDetails } from "./EditDetails";
import { EditLocation } from "./EditLocation";
import { createRoute } from "@tanstack/react-router";
import { userRoute } from "../User";
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

  const { isLoading, error } = useQuery(orpc.user.updates.queryOptions(userId));

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
      <Stack spacing={3}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={index} onChange={(e, index) => setIndex(index)}>
            <Tab label="Details" />
            <Tab label="Location" />
          </Tabs>
        </Box>
        <Box>
          {index === 0 && <EditDetails />}
          {index === 1 && <EditLocation />}
        </Box>
      </Stack>
    </Stack>
  );
}
