import React, { useState } from "react";
import { Indicator } from "../../../components/Indicator";
import { beepStatusMap, decodePolyline } from "../../../utils/utils";
import { BasicUser } from "../../../components/BasicUser";
import { Loading } from "../../../components/Loading";
import { Map } from "../../../components/Map";
import { Marker as BeeperMarker } from "../../../components/Marker";
import { DeleteBeepDialog } from "../../../components/DeleteBeepDialog";
import { createFileRoute, createRoute } from "@tanstack/react-router";
import { useTRPC } from "../../../utils/trpc";
import { DateTime, Interval } from "luxon";
import { keepPreviousData, skipToken, useQuery } from "@tanstack/react-query";
import { Layer, Marker, Source } from "react-map-gl/maplibre";
import { useSubscription } from "@trpc/tanstack-react-query";
import {
  Typography,
  Button,
  Stack,
  Alert,
  useTheme,
  Tooltip,
  Card,
  Grid,
} from "@mui/material";

export const Route = createFileRoute("/admin/beeps/$beepId")({
  component: Beep,
});

function Beep() {
  const trpc = useTRPC();
  const theme = useTheme();

  const { beepId } = Route.useParams();

  const {
    data: beep,
    isPending,
    error,
  } = useQuery(trpc.beep.beep.queryOptions(beepId));

  const { data: beeper } = useSubscription(
    trpc.user.updates.subscriptionOptions(beep ? beep.beeper_id : skipToken),
  );

  const { data: rider } = useSubscription(
    trpc.user.updates.subscriptionOptions(beep ? beep.rider_id : skipToken),
  );

  const { data: route } = useQuery(
    trpc.location.getRoute.queryOptions(
      beep
        ? {
            origin: beep.origin,
            destination: beep.destination,
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

  const [isOpen, setIsOpen] = useState(false);

  if (isPending) {
    return <Loading />;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  const items = [
    {
      title: "Beeper",
      content: <BasicUser user={beep.beeper} />,
    },
    {
      title: "Rider",
      content: <BasicUser user={beep.rider} />,
    },
    {
      title: "Status",
      content: (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography sx={{ textTransform: "capitalize" }}>
            {beep.status.replaceAll("_", " ")}
          </Typography>
          <Indicator color={beepStatusMap[beep.status]} />
        </Stack>
      ),
    },
    {
      title: "Group Size",
      content: beep.groupSize,
    },
    {
      title: "Origin",
      content: beep.origin,
    },
    {
      title: "Destination",
      content: beep.destination,
    },
    {
      title: "Started",
      content: (
        <Typography>
          {new Date(beep.start).toLocaleString()} -{" "}
          {DateTime.fromISO(beep.start).toRelative()}
        </Typography>
      ),
    },
    {
      title: "Ended",
      content: beep.end ? (
        <Typography>
          {new Date(beep.end).toLocaleString()} -{" "}
          {DateTime.fromISO(beep.end).toRelative()}
        </Typography>
      ) : (
        <Typography>Beep is still in progress</Typography>
      ),
    },
    {
      title: "Duration",
      content: beep.end
        ? Interval.fromDateTimes(
            DateTime.fromISO(beep.start),
            DateTime.fromISO(beep.end),
          )
            .toDuration()
            .rescale()
            .set({ milliseconds: 0 })
            .rescale()
            .toHuman()
        : "N/A",
    },
  ];

  return (
    <Stack spacing={2} pb={4}>
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
      <Card sx={{ p: 2, display: "flex", gap: 2, flexDirection: "column" }}>
        <Grid container rowSpacing={2} columnSpacing={2}>
          {items.map((item) => (
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography fontWeight="bold" fontSize="0.95rem">
                {item.title}
              </Typography>
              {item.content}
            </Grid>
          ))}
        </Grid>
      </Card>
      <Card sx={{ height: "500px" }}>
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
      </Card>
      <DeleteBeepDialog
        id={beep.id}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </Stack>
  );
}
