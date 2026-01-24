import React, { useEffect, useState } from "react";
import { Alert, Button, Stack, TextField } from "@mui/material";
import { Marker } from "../../../../components/Marker";
import { Loading } from "../../../../components/Loading";
import { Map } from "../../../../components/Map";
import { editUserRoute } from ".";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import type { MapLayerMouseEvent } from "react-map-gl/maplibre";
import { orpc } from "../../../../utils/orpc";

export function EditLocation() {
  const { userId } = editUserRoute.useParams();

  const { data: user, isLoading, error } = useQuery(
    orpc.user.updates.experimental_liveOptions(userId)
  );

  const {
    mutateAsync: updateUser,
    error: mutateError,
    isPending: mutateLoading,
  } = useMutation(orpc.user.editAdmin.mutationOptions());

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

  if (isLoading) {
    <Loading />;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  if (!user) {
    return null;
  }

  return (
    <Stack spacing={2}>
      {mutateError && <Alert severity="error">{mutateError.message}</Alert>}
      <Stack direction="row" spacing={1}>
        <TextField
          fullWidth
          label="Longitude"
          type="number"
          value={longitude}
          onChange={(value) => setLongitude(Number(value.target.value))}
        />
        <TextField
          fullWidth
          label="Latitude"
          type="number"
          value={latitude}
          onChange={(value) => setLatitude(Number(value.target.value))}
        />
        <Button
          onClick={onUpdate}
          loading={mutateLoading}
          variant="contained"
          sx={{ minWidth: "100px" }}
          disabled={
            latitude === user.location?.latitude &&
            longitude === user.location?.longitude
          }
        >
          Save
        </Button>
      </Stack>
      <div style={{ height: 450, width: "100%" }}>
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
    </Stack>
  );
}
