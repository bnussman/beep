import React from "react";
import { Indicator } from "../../../../components/Indicator";
import { useParams, createFileRoute } from "@tanstack/react-router";
import { Alert, Typography } from "@heroui/react";
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
    return (
      <Alert status="danger">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>{error.message}</Alert.Title>
        </Alert.Content>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <strong>Email</strong>
        <div className="flex items-center gap-2">
          <Indicator color={user.isEmailVerified ? "green" : "red"} />
          <a href={`mailto:${user.email}`} className="underline underline-offset-2">
            {user.email}
          </a>
        </div>
      </div>
      <div>
        <strong>Student</strong>
        <div className="flex items-center gap-2">
          <Indicator color={user.isStudent ? "green" : "red"} />
          <Typography type="body">{user.isStudent ? "Yes" : "No"}</Typography>
        </div>
      </div>
      <div>
        <strong>Beeping</strong>
        <div className="flex items-center gap-2">
          <Indicator color={user.isBeeping ? "green" : "red"} />
          <Typography type="body">{user.isBeeping ? "Yes" : "No"}</Typography>
        </div>
      </div>
      <div>
        <strong>Rating</strong>
        {user.rating ? (
          <Typography type="body">
            {printStars(Number(user.rating))} ({getFormattedRating(user.rating)}
            )
          </Typography>
        ) : (
          <Typography type="body">N/A</Typography>
        )}
      </div>
      <div>
        <strong>Phone</strong>
        <Typography type="body">{user.phone}</Typography>
      </div>
      <div>
        <strong>Queue Size</strong>
        <Typography type="body">{user.queueSize}</Typography>
      </div>
      <div>
        <strong>Capacity</strong>
        <Typography type="body">{user.capacity}</Typography>
      </div>
      <div>
        <strong>Rate</strong>
        <Typography type="body">
          ${user.singlesRate} / ${user.groupRate}
        </Typography>
      </div>
      <div>
        <strong>Venmo usename</strong>
        <Typography type="body">{user.venmo || "N/A"}</Typography>
      </div>
      <div>
        <strong>CashApp usename</strong>
        <Typography type="body">{user.cashapp || "N/A"}</Typography>
      </div>
    </div>
  );
}
