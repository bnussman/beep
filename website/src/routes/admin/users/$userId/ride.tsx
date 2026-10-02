import React from "react";
import { useSubscription } from "../../../../utils/subscriptions";
import { orpc } from "../../../../utils/orpc";
import { beepStatusMap, decodePolyline } from "../../../../utils/utils";
import { Map } from "../../../../components/Map";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { Loading } from "../../../../components/Loading";
import { keepPreviousData, skipToken, useQuery, useQueryClient } from "@tanstack/react-query";
import { Marker as BeeperMarker } from "../../../../components/Marker";
import { Layer, Marker, Source } from "react-map-gl/maplibre";
import { BasicUser } from "../../../../components/BasicUser";
import { DateTime } from "luxon";
import { Indicator } from "../../../../components/Indicator";
import { Alert, Tooltip, Typography } from "@heroui/react";

export const Route = createFileRoute("/admin/users/$userId/ride")({
  component: Ride,
});

function Ride() {
  const queryClient = useQueryClient();

  const { userId } = useParams({ from: Route.id });

  const { data: ride, isLoading, error } = useQuery(
    orpc.rider.currentRide.queryOptions({ input: userId })
  );

  useSubscription({
    ...orpc.rider.currentRideUpdates.liveOptions({
      input: userId,
      context: { ws: true }
    }),
    onData(data) {
      queryClient.setQueryData(
        orpc.rider.currentRide.queryKey({ input: userId }), (prev) => {
          if (data === null) {
            return null;
          }
          if (!prev) {
            return data as typeof ride;
          }
          return { ...prev, ...data };
        }
      );
    },
  });

  const { data: rider } = useQuery(
    orpc.user.updates.liveOptions({
      input: userId,
      context: { ws: true }
    }),
  );

  const { data: beeper } = useQuery(
    orpc.user.updates.liveOptions({
      input: ride ? ride.beeper.id : skipToken,
      context: { ws: true }
    }),
  );

  const { data: route } = useQuery(
    orpc.location.getRoute.queryOptions({
      input: ride
        ? {
          origin: ride.origin,
          destination: ride.destination,
          bias: beeper?.location,
        }
        : skipToken,
      placeholderData: keepPreviousData,
    })
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

  if (isLoading) {
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

  if (!ride) {
    return (
      <div className="flex items-center justify-center py-4">
        User is not in a beep!
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-4">
      <div className="flex flex-col gap-2">
        <div>
          <Typography type="body" className="font-bold">Beeper</Typography>
          <BasicUser user={ride.beeper} />
        </div>
        <div>
          <Typography type="body" className="font-bold">Status</Typography>
          <div className="flex flex-row items-center gap-2">
            <Typography type="body" className="capitalize">
              {ride.status.replaceAll("_", " ")}
            </Typography>
            <Indicator color={beepStatusMap[ride.status]} />
          </div>
        </div>
        <div>
          <Typography type="body" className="font-bold">Origin</Typography>
          <Typography type="body">{ride.origin}</Typography>
        </div>
        <div>
          <Typography type="body" className="font-bold">Destination</Typography>
          <Typography type="body">{ride.destination}</Typography>
        </div>
        <div>
          <Typography type="body" className="font-bold">Group Size</Typography>
          <Typography type="body">{ride.groupSize}</Typography>
        </div>
        <div>
          <Typography type="body" className="font-bold">Started</Typography>
          <Typography type="body" className="whitespace-nowrap">
            {new Date(ride.start).toLocaleString()}
          </Typography>
          <Typography type="body">{DateTime.fromJSDate(ride.start).toRelative()}</Typography>
        </div>
      </div>
      <div className="w-full">
        <Map>
          {origin && (
            <Marker latitude={origin.lat} longitude={origin.lng}>
              <Tooltip>
                <Tooltip.Trigger>
                  <Typography type="body" className="mb-2.5 text-[32px]">📍</Typography>
                </Tooltip.Trigger>
                <Tooltip.Content showArrow>{ride.origin}</Tooltip.Content>
              </Tooltip>
            </Marker>
          )}
          {destination && (
            <Marker latitude={destination.lat} longitude={destination.lng}>
              <Tooltip>
                <Tooltip.Trigger>
                  <Typography type="body" className="mb-2.5 text-[32px]">📍</Typography>
                </Tooltip.Trigger>
                <Tooltip.Content showArrow>{ride.destination}</Tooltip.Content>
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
      </div>
    </div>
  );
}
