import React, { useState } from "react";
import { BasicUser } from "../../../components/BasicUser";
import { Loading } from "../../../components/Loading";
import { Map } from "../../../components/Map";
import { Marker as BeeperMarker } from "../../../components/Marker";
import { DeleteBeepDialog } from "./DeleteBeepDialog";
import { createRoute } from "@tanstack/react-router";
import { beepsRoute } from ".";
import { useTRPC } from "../../../utils/trpc";
import { DateTime } from "luxon";
import { skipToken, useQuery } from "@tanstack/react-query";
import { Layer, Marker, Source } from "react-map-gl/maplibre";
import { useSubscription } from "@trpc/tanstack-react-query";
import {
  Typography,
  Button,
  Box,
  Stack,
  Alert,
  useTheme,
  Tooltip,
} from "@mui/material";

export const beepRoute = createRoute({
  component: Beep,
  path: "$beepId",
  getParentRoute: () => beepsRoute,
});

export function Beep() {
  const trpc = useTRPC();
  const theme = useTheme();

  const { beepId } = beepRoute.useParams();

  const {
    data: beep,
    isPending,
    error,
  } = useQuery(trpc.beep.beep.queryOptions(beepId));

  const { data: beeper } = useSubscription({
    ...trpc.user.updates.subscriptionOptions(beep ? beep.beeper_id : skipToken),
  });

  const { data: route } = useQuery(
    trpc.location.getRoute.queryOptions(
      beep
        ? {
            origin: beep.origin,
            destination: beep.destination,
            bias: beeper?.location,
          }
        : skipToken,
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

  const [isOpen, setIsOpen] = useState(false);

  if (isPending) {
    return <Loading />;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" fontWeight="bold">
          Beep
        </Typography>
        <Button
          variant="contained"
          color="error"
          onClick={() => setIsOpen(true)}
        >
          Delete
        </Button>
      </Stack>
      <Box height="500px">
        <Map>
          {origin && (
            <Marker latitude={origin.lat} longitude={origin.lng}>
              <Tooltip title={beep.origin} arrow>
                <Typography sx={{ fontSize: "32px", mb: 2.5 }}>📍</Typography>
              </Tooltip>
            </Marker>
          )}
          {destination && (
            <Marker latitude={destination.lat} longitude={destination.lng}>
              <Tooltip title={beep.destination} arrow>
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
      <Box>
        <Typography>
          <b>Beeper</b>
        </Typography>
        <BasicUser user={beep.beeper} />
      </Box>
      <Box>
        <Typography>
          <b>Rider</b>
        </Typography>
        <BasicUser user={beep.rider} />
      </Box>
      <Box>
        <Typography>
          <b>Status</b>
        </Typography>
        <Typography>{beep.status.replaceAll("_", " ")}</Typography>
      </Box>
      <Box>
        <Typography>
          <b>Origin</b>
        </Typography>
        <Typography>{beep.origin}</Typography>
      </Box>
      <Box>
        <Typography>
          <b>Destination</b>
        </Typography>
        <Typography>{beep.destination}</Typography>
      </Box>
      <Box>
        <Typography>
          <b>Group Size</b>
        </Typography>
        <Typography>{beep.groupSize}</Typography>
      </Box>
      <Box>
        <Typography>
          <b>Beep Started</b>
        </Typography>
        <Typography>
          {new Date(beep.start).toLocaleString()} -{" "}
          {DateTime.fromISO(beep.start).toRelative()}
        </Typography>
      </Box>
      <Box>
        <Typography>
          <b>Beep Ended</b>
        </Typography>
        {beep.end ? (
          <Typography>
            {new Date(beep.end).toLocaleString()} -{" "}
            {DateTime.fromISO(beep.end).toRelative()}
          </Typography>
        ) : (
          <Typography>Beep is still in progress</Typography>
        )}
      </Box>
      <DeleteBeepDialog
        id={beep.id}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </Stack>
  );
}

/**
 * Full credit to https://github.com/huextrat/react-native-maps-routes/blob/main/src/utils/decoder.ts
 */
export const decodePolyline = (polyline: string) => {
  const points = [];
  const encoded = polyline;
  let index = 0;
  const len = encoded.length;
  let lat = 0;
  let lng = 0;
  while (index < len) {
    let b: number;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charAt(index++).charCodeAt(0) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dLat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lat += dLat;
    shift = 0;
    result = 0;
    do {
      b = encoded.charAt(index++).charCodeAt(0) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dLng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lng += dLng;

    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return points;
};

export function getMiles(meters: number, round = false) {
  const miles = meters * 0.000621;

  if (round) {
    return new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }).format(miles);
  }

  return miles;
}
