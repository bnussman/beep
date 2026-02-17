import React from "react";
import { Marker } from "../../../src/components/Marker";
import { Map } from "../../../src/components/Map";
import { createFileRoute } from "@tanstack/react-router";
import { useTRPC } from "../../../src/utils/trpc";
import { Loading } from "../../../src/components/Loading";
import { Alert, Box } from "@mui/material";

import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/admin/users/$userId/location")({
  component: LocationView,
});

export function LocationView() {
  const trpc = useTRPC();
  const { userId } = Route.useParams();

  const { data: user, isLoading, error } = useQuery(trpc.user.user.queryOptions(userId));

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  if (!user?.location) {
    return (
      <Box textAlign="center" height="100px">
        This user has no Location data.
      </Box>
    );
  }

  return (
    <Box>
      <div style={{ height: 550, width: "100%" }}>
        <Map
          initialViewState={{
            latitude: user.location.latitude,
            longitude: user.location.longitude,
            zoom: 13,
          }}
        >
          <Marker
            latitude={user.location.latitude}
            longitude={user.location.longitude}
            userId={user.id}
            username={user.username}
            photo={user.photo}
            name={`${user.first} ${user.last}`}
            variant="default"
          />
        </Map>
      </div>
    </Box>
  );
}
