import React from "react";
import { Box, Text, Stack, Tooltip } from "@chakra-ui/react";
import { Indicator } from "../../../components/Indicator";
import { Error } from "../../../components/Error";
import { printStars } from "../ratings";
import { createRoute, useParams } from "@tanstack/react-router";
import { userRoute } from "./User";
import { trpc } from "../../../utils/trpc";

export const userDetailsRoute = createRoute({
  component: Details,
  path: 'details',
  getParentRoute: () => userRoute,
});

export const userDetailsInitalRoute = createRoute({
  component: Details,
  path: '/',
  getParentRoute: () => userRoute,
});

export function Details() {
  const { userId } = useParams({ from: "/admin/users/$userId" });

  const { data: user, isLoading, error } = trpc.user.user.useQuery(userId);

  if (isLoading || !user) {
    return null
  }

  if (error) {
    return <Error>{error.message}</Error>;
  }

  return (
    <Stack spacing={2}>
      <Box>
        <strong>Email:</strong>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Indicator mr={2} color={user.isEmailVerified ? "green" : "red"} />
          <Text>{user.email}</Text>
        </Stack>
      </Box>
      <Box>
        <strong>Push Notification Token:</strong>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Indicator mr={2} color={user.pushToken ? "green" : "red"} />
          <Text>{user.pushToken ?? "N/A"}</Text>
        </Stack>
      </Box>
      <Box>
        <strong>Rating:</strong>
        {user.rating ?
          <Text>
            <Tooltip label={user.rating} aria-label={`User rating of ${user.rating}`}>
              {printStars(Number(user.rating))}
            </Tooltip>
          </Text>
          :
          <Text>
            No Rating
          </Text>
        }
      </Box>
      <Box>
        <strong>Phone:</strong>
        <Text>{user.phone || ''}</Text>
      </Box>
      <Box>
        <strong>Queue Size:</strong>
        <Text>{user.queueSize}</Text>
      </Box>
      <Box>
        <strong>Capacity:</strong>
        <Text>{user.capacity}</Text>
      </Box>
      <Box>
        <strong>Rate:</strong>
        <Text>${user.singlesRate} / ${user.groupRate}</Text>
      </Box>
      <Box>
        <strong>Venmo usename:</strong>
        <Text>{user.venmo || "N/A"}</Text>
      </Box>
      <Box>
        <strong>CashApp usename:</strong>
        <Text>{user.cashapp || "N/A"}</Text>
      </Box>
    </Stack>
  );
}
