import React from "react";
import { Indicator } from "../../../../components/Indicator";
import { useParams, createFileRoute } from "@tanstack/react-router";
import { Typography } from "@heroui/react";
import { Alert, Box, Link } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getFormattedRating, printStars } from "../../../../utils/utils";
import { orpc } from "../../../../utils/orpc";
import { Loading } from "../../../../components/Loading";

export const Route = createFileRoute('/admin/users/$userId/$')({
  component: Details,
  ssr: false,
});

function Details() {
  const { userId } = useParams({ from: Route.id });

  const {
    data: user,
    isPending,
    error,
  } = useQuery(
    orpc.user.user.queryOptions({ input: userId })
  );

  if (isPending) {
    return <Loading />;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <div className="flex flex-col gap-4">
      <Box>
        <strong>Email</strong>
        <div className="flex items-center gap-2">
          <Indicator color={user.isEmailVerified ? "green" : "red"} />
          <Link href={`mailto:${user.email}`}>{user.email}</Link>
        </div>
      </Box>
      <Box>
        <strong>Student</strong>
        <div className="flex items-center gap-2">
          <Indicator color={user.isStudent ? "green" : "red"} />
          <Typography type="body">{user.isStudent ? "Yes" : "No"}</Typography>
        </div>
      </Box>
      <Box>
        <strong>Beeping</strong>
        <div className="flex items-center gap-2">
          <Indicator color={user.isBeeping ? "green" : "red"} />
          <Typography type="body">{user.isBeeping ? "Yes" : "No"}</Typography>
        </div>
      </Box>
      <Box>
        <strong>Rating</strong>
        {user.rating ? (
          <Typography type="body">
            {printStars(Number(user.rating))} ({getFormattedRating(user.rating)}
            )
          </Typography>
        ) : (
          <Typography type="body">N/A</Typography>
        )}
      </Box>
      <Box>
        <strong>Phone</strong>
        <Typography type="body">{user.phone}</Typography>
      </Box>
      <Box>
        <strong>Queue Size</strong>
        <Typography type="body">{user.queueSize}</Typography>
      </Box>
      <Box>
        <strong>Capacity</strong>
        <Typography type="body">{user.capacity}</Typography>
      </Box>
      <Box>
        <strong>Rate</strong>
        <Typography type="body">
          ${user.singlesRate} / ${user.groupRate}
        </Typography>
      </Box>
      <Box>
        <strong>Venmo usename</strong>
        <Typography type="body">{user.venmo || "N/A"}</Typography>
      </Box>
      <Box>
        <strong>CashApp usename</strong>
        <Typography type="body">{user.cashapp || "N/A"}</Typography>
      </Box>
    </div>
  );
}
