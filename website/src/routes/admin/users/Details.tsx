import React from "react";
import { GetUserQuery } from "../../../generated/graphql";
import { Box, Text, Stack, Tooltip } from "@chakra-ui/react";
import { Indicator } from "../../../components/Indicator";
import { printStars } from "../ratings";
import { Route } from "@tanstack/react-router";
import { GetUser, userRoute } from "./User";
import { useQuery } from "@apollo/client";

export const userDetailsRoute = new Route({
  component: Details,
  path: 'details',
  getParentRoute: () => userRoute,
});

export function Details() {
  const { userId } = userDetailsRoute.useParams();

  const { data } = useQuery<GetUserQuery>(GetUser, { variables: { id: userId } });

  const user = data?.getUser;

  if (!user) return null;

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
              {printStars(user.rating)}
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
