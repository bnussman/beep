import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "../../../../utils/trpc";
import { EditDetails } from "./edit/$";
import { EditLocation } from "./edit/location";
import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import {
  Alert,
  Box,
  CircularProgress,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

export const Route = createFileRoute('/admin/users/$userId/edit')({
  component: Edit,
});

export function Edit() {
  const trpc = useTRPC();
  const { userId } = Route.useParams();

  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  const { data: user, isLoading, error } = useQuery(trpc.user.user.queryOptions(userId));

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
          <Tabs value={pathname.endsWith('location') ? 1 : 0}>
            <Tab
              label="Details"
              LinkComponent={Link}
              href={`/admin/users/${userId}/edit/details`}
             />
            <Tab
              label="Location"
              LinkComponent={Link}
              href={`/admin/users/${userId}/edit/location`}
            />
          </Tabs>
        </Box>
        <Box>
          <Outlet />
        </Box>
      </Stack>
    </Stack>
  );
}
