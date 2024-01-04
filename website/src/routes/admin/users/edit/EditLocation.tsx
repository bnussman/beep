import React, { useEffect, useState } from "react";
import { Box, Button, FormControl, FormLabel, HStack, Input } from "@chakra-ui/react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { LocationUpdateMutation, UserLocationQuery } from "../../../../generated/graphql";
import { Marker } from "../../../../components/Marker";
import { Loading } from "../../../../components/Loading";
import { Error } from '../../../../components/Error';
import { Map } from '../../../../components/Map';
import { MapProps } from 'mapkit-react';
import { editUserRoute } from ".";

export const UserLocation = gql`
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
`;

const LocationUpdate = gql`
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
`;


export function EditLocation() {
  const { userId: id } = editUserRoute.useParams();
  const { data, loading, error, refetch } = useQuery<UserLocationQuery>(UserLocation, { variables: { id } });
  const [update, { error: mutateError, loading: mutateLoading }] = useMutation<LocationUpdateMutation>(LocationUpdate);

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
        longitude,
        latitude
      }
    });

    refetch();
  };

  const onMapClick: MapProps['onClick'] = (data) => {
    const cords = data.toCoordinates()
    setLongitude(cords.longitude);
    setLatitude(cords.latitude);
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
            initialRegion={{
              centerLatitude: user.location.latitude,
              centerLongitude: user.location.longitude,
              latitudeDelta: 3,
              longitudeDelta: 3,
            }}
          >
            <Marker
              latitude={user.location.latitude}
              longitude={user.location.longitude}
              username={user.username}
              name={user.name}
            />
          </Map>
        </div>
      )}
    </Box>
  );
}
