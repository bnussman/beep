import React, { useState } from "react";
import { EditDetails } from "../../../src/components/admin/users/edit/EditDetails";
import { EditLocation } from "../../../src/components/admin/users/edit/EditLocation";
import { createFileRoute } from "@tanstack/react-router";
import { useTRPC } from "../../../src/utils/trpc";
import {
  Alert,
  Box,
  CircularProgress,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/admin/users/$userId/edit")({
  component: Edit,
});

export function Edit() {
  const trpc = useTRPC();
  const { userId } = Route.useParams();

  const { data: user, isLoading, error } = useQuery(trpc.user.user.queryOptions(userId));

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
