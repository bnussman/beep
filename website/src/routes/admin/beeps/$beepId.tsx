import React, { useState } from "react";
import { orpc } from "../../../utils/orpc";
import { Indicator } from "../../../components/Indicator";
import { beepStatusMap, decodePolyline } from "../../../utils/utils";
import { BasicUser } from "../../../components/BasicUser";
import { Loading } from "../../../components/Loading";
import { Map } from "../../../components/Map";
import { Marker as BeeperMarker } from "../../../components/Marker";
import { DeleteBeepDialog } from "../../../components/DeleteBeepDialog";
import { DateTime, Interval } from "luxon";
import { keepPreviousData, skipToken, useQuery, useQueryClient } from "@tanstack/react-query";
import { Layer, Marker, Source } from "react-map-gl/maplibre";
import {
  createFileRoute,
  useRouter,
} from "@tanstack/react-router";
import { Alert, Button, Card, Tooltip, Typography } from "@heroui/react";
import { useSubscription } from "../../../utils/subscriptions";

export const Route = createFileRoute("/admin/beeps/$beepId")({
  component: Beep,
});

function Beep() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { beepId } = Route.useParams();

  const {
    data: beep,
    isPending,
    error,
  } = useQuery(orpc.beep.beep.queryOptions({ input: beepId }));

  useSubscription({
    ...orpc.beep.beepUpdates.liveOptions({
      input: beepId,
      context: { ws: true }
    }),
    onData(data) {
      queryClient.setQueryData(orpc.beep.beep.queryKey({ input: beepId }), (prev) => {
        if (!prev) {
          return undefined;
        }

        return {
          ...prev,
          ...data,
        }
      });
    },
  });

  const { data: beeper } = useQuery(
    orpc.user.updates.liveOptions({
      input: beep ? beep.beeper_id : skipToken,
      context: { ws: true }
    }),
  );

  const { data: rider } = useQuery(
    orpc.user.updates.liveOptions({
      input: beep ? beep.rider_id : skipToken,
      context: { ws: true }
    }),
  );

  const { data: route } = useQuery(
    orpc.location.getRoute.queryOptions({
      input: beep
        ? {
          origin: beep.origin,
          destination: beep.destination,
          bias: beeper?.location,
        }
        : skipToken,
      placeholderData: keepPreviousData,
    }),
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
    return (
      <Alert status="danger">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>{error.message}</Alert.Title>
        </Alert.Content>
      </Alert>
    );
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
        <div className="flex items-center gap-2">
          <Typography type="body" className="capitalize">
            {beep.status.replaceAll("_", " ")}
          </Typography>
          <Indicator color={beepStatusMap[beep.status]} />
        </div>
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
        <Typography type="body">
          {new Date(beep.start).toLocaleString()} -{" "}
          {DateTime.fromJSDate(beep.start).toRelative()}
        </Typography>
      ),
    },
    {
      title: "Ended",
      content: beep.end ? (
        <Typography type="body">
          {new Date(beep.end).toLocaleString()} -{" "}
          {DateTime.fromJSDate(beep.end).toRelative()}
        </Typography>
      ) : (
        <Typography type="body">Beep is still in progress</Typography>
      ),
    },
    {
      title: "Duration",
      content: beep.end
        ? Interval.fromDateTimes(
          DateTime.fromJSDate(beep.start),
          DateTime.fromJSDate(beep.end),
        )
          .toDuration()
          .rescale()
          .set({ milliseconds: 0 })
          .rescale()
          .toHuman()
        : "N/A",
    },
    {
      title: "Pick Up ETA",
      content: beep.pick_up_eta ? (() => {
        const date = DateTime.fromJSDate(beep.pick_up_eta!);
        const isInThePast = date < DateTime.now();

        return (
          <div className="flex flex-col">
            <Typography type="body">
              {isInThePast ? date.toLocaleString({ timeStyle: "short" }) : date.toRelative()}
            </Typography>
            <Typography type="body-sm">
              updated {DateTime.fromJSDate(beep.pick_up_eta_updated_at!).toRelative()}
            </Typography>
          </div>
        );
      })() : (
        <Typography type="body">N/A</Typography>
      )
    },
  ];

  return (
    <div className="flex flex-col gap-4 pb-8">
      <div className="flex flex-row items-center justify-between">
        <Typography type="h1">
          Beep
        </Typography>
        <Button variant="danger" onPress={() => setIsOpen(true)}>
          Delete
        </Button>
      </div>
      <Card className="flex flex-col gap-4 rounded-lg border border-separator bg-surface p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((item) => (
            <div key={item.title}>
              <Typography type="body" className="text-[0.95rem] font-bold">
                {item.title}
              </Typography>
              {item.content}
            </div>
          ))}
        </div>
      </Card>
      <Card className="h-[500px] overflow-hidden rounded-2xl">
        <Map>
          {origin && (
            <Marker latitude={origin.lat} longitude={origin.lng}>
              <Tooltip>
                <Tooltip.Trigger>
                  <Typography type="body" className="mb-2.5 text-[32px]">📍</Typography>
                </Tooltip.Trigger>
                <Tooltip.Content showArrow>{beep.origin}</Tooltip.Content>
              </Tooltip>
            </Marker>
          )}
          {destination && (
            <Marker latitude={destination.lat} longitude={destination.lng}>
              <Tooltip>
                <Tooltip.Trigger>
                  <Typography type="body" className="mb-2.5 text-[32px]">📍</Typography>
                </Tooltip.Trigger>
                <Tooltip.Content showArrow>{beep.destination}</Tooltip.Content>
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
                "line-color": "#0288d1",
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
        onSuccess={() => router.history.back()}
      />
    </div>
  );
}
