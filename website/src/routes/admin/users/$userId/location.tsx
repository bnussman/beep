import React from "react";
import { Marker } from "../../../../components/Marker";
import { Map } from "../../../../components/Map";
import { createFileRoute } from "@tanstack/react-router";
import { Loading } from "../../../../components/Loading";
import { Alert } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "../../../../utils/orpc";

export const Route = createFileRoute('/admin/users/$userId/location')({
  component: LocationView,
});

function LocationView() {
  const { userId } = Route.useParams();

  const { data: user, isLoading, error } = useQuery(
    orpc.user.user.queryOptions({ input: userId })
  );

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

  if (!user?.location) {
    return (
      <div className="flex items-center justify-center py-4">
        This user does not have location data.
      </div>
    );
  }

  return (
    <div>
      <div className="h-137.5 w-full">
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
    </div>
  );
}
