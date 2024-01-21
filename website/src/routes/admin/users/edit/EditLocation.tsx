import React, { useEffect, useState } from "react";
import { Box, Button, FormControl, FormLabel, HStack, Input } from "@chakra-ui/react";
import { useMutation, useQuery } from "@apollo/client";
import { Marker } from "../../../../components/Marker";
import { Loading } from "../../../../components/Loading";
import { Error } from '../../../../components/Error';
import { Map } from '../../../../components/Map';
import { editUserRoute } from ".";
import type { MapLayerMouseEvent } from 'react-map-gl';
import { graphql } from "gql.tada";

export const UserLocation = graphql(`
  query UserLocation($id: String!) {
    getUser(id: $id) {
      id
      name
      photo
      username
      location {
        latitude
        longitude
      }
    }
  }
`);

const LocationUpdate = graphql(`
  mutation LocationUpdate(
    $id: String!,
    $latitude: Float!,
    $longitude: Float!,
  ) {
    setLocation(location: {
      latitude: $latitude,
      longitude: $longitude,
    }, id: $id) {
      id
      location {
        latitude
        longitude
      }
    }
  }
`);


export function EditLocation() {
  const { userId: id } = editUserRoute.useParams();
  const { data, loading, error, refetch } = useQuery(UserLocation, { variables: { id } });
  const [update, { error: mutateError, loading: mutateLoading }] = useMutation(LocationUpdate);

  const user = data?.getUser;

  const [longitude, setLongitude] = useState<number>();
  const [latitude, setLatitude] = useState<number>();

  useEffect(() => {
    if (user) {
      setLongitude(user.location?.longitude);
      setLatitude(user.location?.latitude);
    }
  }, [user]);

  const onUpdate = async () => {
    await update({
      variables: {
        id,
        longitude: longitude ?? 0,
        latitude: latitude ?? 0
      }
    });

    refetch();
  };

  const onMapClick = (data: MapLayerMouseEvent) => {
    setLongitude(data.lngLat.lng);
    setLatitude(data.lngLat.lat);
  };

  if (loading) {
    <Loading />
  }

  if (error) {
    return <Error error={error} />;
  }

  if (!user) {
    return null;
  }

  return (
    <Box>
      {mutateError && (<Error error={mutateError} />)}
      <HStack mb={4} alignItems="flex-end">
        <FormControl>
          <FormLabel>Longitude</FormLabel>
          <Input
            type="number"
            value={longitude}
            onChange={(value: any) => setLongitude(Number(value.target.value))}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Latitude</FormLabel>
          <Input
            type="number"
            value={latitude}
            onChange={(value: any) => setLatitude(Number(value.target.value))}
          />
        </FormControl>
        <Button
          w="150px"
          onClick={onUpdate}
          isLoading={mutateLoading}
        >
          Save
        </Button>
      </HStack>
      {user.location && (
        <div style={{ height: 450, width: '100%' }}>
          <Map
            onClick={onMapClick}
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
              name={user.name}
            />
          </Map>
        </div>
      )}
    </Box>
  );
}
