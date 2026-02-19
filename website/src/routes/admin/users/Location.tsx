import React from "react";
import { Marker } from "../../../components/Marker";
import { Map } from "../../../components/Map";
import { createRoute } from "@tanstack/react-router";
import { userRoute } from "./User";
import { useTRPC } from "../../../utils/trpc";
import { Loading } from "../../../components/Loading";
import { Alert, Box } from "@mui/material";

import { useQuery } from "@tanstack/react-query";

export const locationRoute = createRoute({
  component: LocationView,
  path: "location",
  getParentRoute: () => userRoute,
});

export function LocationView() {
  const trpc = useTRPC();
  const { userId } = locationRoute.useParams();

  const { data: user, isLoading, error } = useQuery(trpc.user.user.queryOptions(userId));

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  if (!user?.location) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" py={2}>
        This user does not have location data.
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
