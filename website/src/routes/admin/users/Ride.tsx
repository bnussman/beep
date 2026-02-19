import React from "react";
import { Map } from "../../../components/Map";
import { createRoute, useParams } from "@tanstack/react-router";
import { userRoute } from "./User";
import { useTRPC } from "../../../utils/trpc";
import { Loading } from "../../../components/Loading";
import { Alert, Box, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import { useSubscription } from "@trpc/tanstack-react-query";
import { keepPreviousData, skipToken, useQuery } from "@tanstack/react-query";
import { Marker as BeeperMarker } from "../../../components/Marker";
import { Layer, Marker, Source } from "react-map-gl/maplibre";
import { decodePolyline } from "../beeps/Beep";
import { BasicUser } from "../../../components/BasicUser";
import { DateTime } from "luxon";
import { Indicator } from "../../../components/Indicator";
import { beepStatusMap } from "../beeps";

export const rideRoute = createRoute({
  component: Ride,
  path: "ride",
  getParentRoute: () => userRoute,
});

export function Ride() {
  const trpc = useTRPC();
  const theme = useTheme();

  const { userId } = useParams({ from: '/admin/users/$userId'});

  const { data: ride, error } = useSubscription(trpc.rider.currentRideUpdates.subscriptionOptions(userId));

  const { data: rider } = useSubscription(
    trpc.user.updates.subscriptionOptions(userId)
  );

  const { data: beeper } = useSubscription(
    trpc.user.updates.subscriptionOptions(ride ? ride.beeper.id : skipToken)
  );

  const { data: route } = useQuery(
    trpc.location.getRoute.queryOptions(
      ride
        ? {
            origin: ride.origin,
            destination: ride.destination,
            bias: beeper?.location,
          }
        : skipToken,
      {
        placeholderData: keepPreviousData,
      },
    ),
  );

  const polylineCoordinates = route?.routes[0].legs
    .flatMap((leg) => leg.steps)
    .map((step) => decodePolyline(step.geometry))
    .flat();

  const poly = polylineCoordinates?.map(({ lat, lng }) => [lng, lat]);

  const origin = route && {
    lat: route.waypoints[0].location[1],
    lng: route.waypoints[0].location[0],
  };

  const destination = route && {
    lat: route.waypoints[1].location[1],
    lng: route.waypoints[1].location[0],
  };

  if (ride === undefined) {
    return <Loading />;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  if (!ride) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" py={2}>
        User is not in a beep!
      </Box>
    );
  }

  return (
    <Stack direction="row" gap={2}>
      <Stack spacing={1}>
        <Box>
          <Typography fontWeight="bold">Beeper</Typography>
          <BasicUser user={ride.beeper} />
        </Box>
        <Box>
          <Typography fontWeight="bold">Status</Typography>
          <Stack direction="row" alignItems="center" gap={1}>
            <Typography textTransform="capitalize">{ride.status.replaceAll("_", " ")}</Typography>
            <Indicator color={beepStatusMap[ride.status]} />
          </Stack>
        </Box>
        <Box>
          <Typography fontWeight="bold">Origin</Typography>
          <Typography>{ride.origin}</Typography>
        </Box>
        <Box>
          <Typography fontWeight="bold">Destination</Typography>
          <Typography>{ride.destination}</Typography>
        </Box>
        <Box>
          <Typography fontWeight="bold">Group Size</Typography>
          <Typography>{ride.groupSize}</Typography>
        </Box>
        <Box>
          <Typography fontWeight="bold">Started</Typography>
          <Typography style={{ textWrap: 'nowrap' }}>
            {new Date(ride.start).toLocaleString()}
          </Typography>
          <Typography>
            {DateTime.fromISO(ride.start).toRelative()}
          </Typography>
        </Box>
      </Stack>
      <Box width="100%">
        <Map>
          {origin && (
            <Marker latitude={origin.lat} longitude={origin.lng}>
              <Tooltip title={ride.origin} arrow>
                <Typography sx={{ fontSize: "32px", mb: 2.5 }}>📍</Typography>
              </Tooltip>
            </Marker>
          )}
          {destination && (
            <Marker latitude={destination.lat} longitude={destination.lng}>
              <Tooltip title={ride.destination} arrow>
                <Typography sx={{ fontSize: "32px", mb: 2.5 }}>📍</Typography>
              </Tooltip>
            </Marker>
          )}
          {beeper?.location && (
            <BeeperMarker
              latitude={beeper.location?.latitude}
              longitude={beeper.location?.longitude}
              username={beeper.username}
              userId={beeper.id}
              photo={beeper.photo}
              name={`${beeper.first} ${beeper.last}`}
            />
          )}
          {rider?.location && (
            <BeeperMarker
              latitude={rider.location?.latitude}
              longitude={rider.location?.longitude}
              username={rider.username}
              userId={rider.id}
              photo={rider.photo}
              name={`${rider.first} ${rider.last}`}
            />
          )}
          <Source
            type="geojson"
            data={{
              type: "LineString",
              coordinates: poly ?? [],
            }}
          >
            <Layer
              type="line"
              paint={{
                "line-color": theme.palette.info.main,
                "line-width": 5,
              }}
            />
          </Source>
        </Map>
      </Box>   
    </Stack>
  );
}
