import React, { useEffect, useState } from "react";
import { Box, Button, FormControl, FormLabel, HStack, Input } from "@chakra-ui/react";
import { Marker } from "../../../../components/Marker";
import { Loading } from "../../../../components/Loading";
import { Error } from '../../../../components/Error';
import { Map } from '../../../../components/Map';
import { editUserRoute } from ".";
import { trpc } from "../../../../utils/trpc";
import type { MapLayerMouseEvent } from 'react-map-gl/maplibre';

export function EditLocation() {
  const { userId } = editUserRoute.useParams();

  const {
    data: user,
    isLoading,
    error,
  } = trpc.user.user.useQuery(userId);

  const {
    mutateAsync: updateUser,
    error: mutateError,
    isPending: mutateLoading
  } = trpc.user.editAdmin.useMutation();

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
          latitude: latitude ?? 0
        }
      }
    });
  };

  const onMapClick = (data: MapLayerMouseEvent) => {
    setLongitude(data.lngLat.lng);
    setLatitude(data.lngLat.lat);
  };

  if (isLoading) {
    <Loading />
  }

  if (error) {
    return <Error>{error.message}</Error>;
  }

  if (!user) {
    return null;
  }

  return (
    <Box>
      {mutateError && <Error>{mutateError.message}</Error>}
      <HStack mb={4} alignItems="flex-end">
        <FormControl>
          <FormLabel>Longitude</FormLabel>
          <Input
            type="number"
            value={longitude}
            onChange={(value) => setLongitude(Number(value.target.value))}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Latitude</FormLabel>
          <Input
            type="number"
            value={latitude}
            onChange={(value) => setLatitude(Number(value.target.value))}
          />
        </FormControl>
        <Button
          w="150px"
          onClick={onUpdate}
          isLoading={mutateLoading}
          isDisabled={latitude === user.location?.latitude && longitude === user.location?.longitude}
        >
          Save
        </Button>
      </HStack>
      <div style={{ height: 450, width: '100%' }}>
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
    </Box>
  );
}
