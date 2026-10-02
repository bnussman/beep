import React from "react";
import { orpc } from "../../../../utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { Typography } from "@heroui/react";
import {
  Alert,
  Box,
  CircularProgress,
  Tab,
  Tabs,
} from "@mui/material";

export const Route = createFileRoute('/admin/users/$userId/edit')({
  component: Edit,
});

function Edit() {
  const { userId } = Route.useParams();

  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  const { isLoading, error } = useQuery(
    orpc.user.user.queryOptions({ input: userId })
  );

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <div className="flex flex-col">
      <Typography type="h1">
        Edit
      </Typography>
      <div className="flex flex-col gap-6">
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
      </div>
    </div>
  );
}
