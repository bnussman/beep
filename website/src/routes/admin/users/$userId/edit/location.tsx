import React, { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Alert, Button, FieldError, Input, Label, TextField } from "@heroui/react";
import { Marker } from "../../../../../components/Marker";
import { Loading } from "../../../../../components/Loading";
import { Map } from "../../../../../components/Map";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { orpc } from "../../../../../utils/orpc";
import type { MapLayerMouseEvent } from "react-map-gl/maplibre";

export const Route = createFileRoute('/admin/users/$userId/edit/location')({
  component: EditLocation
})

function EditLocation() {
  const { userId } = Route.useParams();

  const { data: user, isPending, error } = useQuery(
    orpc.user.user.queryOptions({ input: userId })
  );

  const {
    mutateAsync: updateUser,
    error: mutateError,
    isPending: mutateLoading,
  } = useMutation(
    orpc.user.editAdmin.mutationOptions()
  );

  const [longitude, setLongitude] = useState<number>();
  const [latitude, setLatitude] = useState<number>();

  useEffect(() => {
    if (user) {
      setLongitude(user.location?.longitude);
      setLatitude(user.location?.latitude);
    }
  }, [user]);

  const onUpdate = async () => {
    await updateUser({
      userId,
      data: {
        location: {
          longitude: longitude ?? 0,
          latitude: latitude ?? 0,
        },
      },
    });
  };

  const onMapClick = (data: MapLayerMouseEvent) => {
    setLongitude(data.lngLat.lng);
    setLatitude(data.lngLat.lat);
  };

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
      {mutateError && (
        <Alert status="danger">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>{mutateError.message}</Alert.Title>
          </Alert.Content>
        </Alert>
      )}
      <div className="flex flex-row gap-2">
        <TextField
          className="min-w-0 flex-1"
          type="number"
          value={longitude?.toString() ?? ""}
          onChange={(value) => setLongitude(Number(value))}
        >
          <Label>Longitude</Label>
          <Input />
          <FieldError />
        </TextField>
        <TextField
          className="min-w-0 flex-1"
          type="number"
          value={latitude?.toString() ?? ""}
          onChange={(value) => setLatitude(Number(value))}
        >
          <Label>Latitude</Label>
          <Input />
          <FieldError />
        </TextField>
        <Button
          className="min-w-25 self-end"
          onPress={onUpdate}
          isPending={mutateLoading}
          isDisabled={
            latitude === user.location?.latitude &&
            longitude === user.location?.longitude
          }
        >
          Save
        </Button>
      </div>
      <div className="h-112.5 w-full">
        <Map
          onClick={onMapClick}
          initialViewState={{
            latitude: user.location?.latitude ?? 0,
            longitude: user.location?.longitude ?? 0,
            zoom: 13,
          }}
        >
          {user.location && (
            <Marker
              latitude={user.location.latitude}
              longitude={user.location.longitude}
              userId={user.id}
              username={user.username}
              photo={user.photo}
              name={`${user.first} ${user.last}`}
            />
          )}
        </Map>
      </div>
    </div>
  );
}
