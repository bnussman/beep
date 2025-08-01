import React from "react";
import { Indicator } from "../../../components/Indicator";
import { printStars } from "../ratings";
import { createRoute, useParams } from "@tanstack/react-router";
import { userRoute } from "./User";
import { useTRPC } from "../../../utils/trpc";
import { Alert, Stack, Typography, Tooltip, Box, Link } from "@mui/material";

import { useQuery } from "@tanstack/react-query";

export const userDetailsRoute = createRoute({
  component: Details,
  path: "details",
  getParentRoute: () => userRoute,
});

export const userDetailsInitalRoute = createRoute({
  component: Details,
  path: "/",
  getParentRoute: () => userRoute,
});

export function Details() {
  const trpc = useTRPC();
  const { userId } = useParams({ from: "/admin/users/$userId" });

  const { data: user, isLoading, error } = useQuery(trpc.user.user.queryOptions(userId));

  if (isLoading || !user) {
    return null;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <Stack spacing={2}>
      <Box>
        <strong>Email:</strong>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Indicator mr={2} color={user.isEmailVerified ? "green" : "red"} />
          <Link href={`mailto:${user.email}`}>{user.email}</Link>
        </Stack>
      </Box>
      <Box>
        <strong>Push Notification Token:</strong>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Indicator mr={2} color={user.pushToken ? "green" : "red"} />
          <Typography>{user.pushToken ?? "N/A"}</Typography>
        </Stack>
      </Box>
      <Box>
        <strong>Rating:</strong>
        {user.rating ? (
          <Typography>{printStars(Number(user.rating))} ({user.rating})</Typography>
        ) : (
          <Typography>No Rating</Typography>
        )}
      </Box>
      <Box>
        <strong>Phone:</strong>
        <Typography>{user.phone}</Typography>
      </Box>
      <Box>
        <strong>Queue Size:</strong>
        <Typography>{user.queueSize}</Typography>
      </Box>
      <Box>
        <strong>Capacity:</strong>
        <Typography>{user.capacity}</Typography>
      </Box>
      <Box>
        <strong>Rate:</strong>
        <Typography>
          ${user.singlesRate} / ${user.groupRate}
        </Typography>
      </Box>
      <Box>
        <strong>Venmo usename:</strong>
        <Typography>{user.venmo || "N/A"}</Typography>
      </Box>
      <Box>
        <strong>CashApp usename:</strong>
        <Typography>{user.cashapp || "N/A"}</Typography>
      </Box>
    </Stack>
  );
}
