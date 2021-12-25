import React, { useEffect, useState } from "react";
import GoogleMapReact from 'google-map-react';
import { Box, Button, FormControl, FormLabel, HStack, Input } from "@chakra-ui/react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { LocationUpdateMutation, UserLocationQuery } from "../../../../generated/graphql";
import { Marker } from "../../../../components/Marker";
import { Loading } from "../../../../components/Loading";
import { Error } from '../../../../components/Error';

export const UserLocation = gql`
  query UserLocation($id: String!) {
    getUser(id: $id) {
      id
      name
      photoUrl
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
    }, id: $id)
  }
`;


export function EditLocation() {
  const { id } = useParams();
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

  const onMapClick = (data: GoogleMapReact.ClickEventValue) => {
    const { lat, lng } = data;
    setLongitude(lng);
    setLatitude(lat);
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
          <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyBgabJrpu7-ELWiUIKJlpBz2mL6GYjwCVI' }}
            defaultCenter={{ lat: user.location.latitude, lng: user.location.longitude }}
            defaultZoom={15}
            center={{ lat: user.location.latitude, lng: user.location.longitude }}
            onClick={onMapClick}
          >
            <Marker
              lat={user.location.latitude}
              lng={user.location.longitude}
              text={user.name}
              photoUrl={user.photoUrl}
            />
          </GoogleMapReact>
        </div>
      )}
    </Box>
  );
}