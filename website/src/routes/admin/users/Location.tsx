import React, { useEffect } from 'react';
import { gql } from '@apollo/client';
import { Box, Center } from '@chakra-ui/react';
import { GetUserQuery } from '../../../generated/graphql';
import { cache, client } from '../../../utils/Apollo';
import { Marker } from '../../../components/Marker';
import { Map } from '../../../components/Map';

interface Props {
  user: GetUserQuery['getUser'];
}

const BeepersLocation = gql`
  subscription BeepersLocation($id: String!) {
    getLocationUpdates(id: $id) {
      latitude
      longitude
    }
  }
`;

let sub: any;

export function LocationView(props: Props) {
  const { user } = props;

  async function subscribe() {
    const a = client.subscribe({ query: BeepersLocation, variables: { id: user.id } });

    sub = a.subscribe(({ data }) => {
      cache.modify({
        id: cache.identify({
          __typename: "User",
          id: user.id,
        }),
        fields: {
          location() {
            return {
              latitude: data.getLocationUpdates.latitude,
              longitude: data.getLocationUpdates.longitude,
            };
          },
        },
      });
    });
  }

  useEffect(() => {
    subscribe();

    return () => {
      sub?.unsubscribe();
    };
  }, []);

  if (!user.location) {
    return (
      <Center h="100px">
        This user has no Location data.
      </Center>
    );
  }

  return (
    <Box height="550px" borderRadius="20px" overflow="hidden">
      <Map
        initialRegion={{
          centerLatitude: user.location.latitude,
          centerLongitude: user.location.longitude,
          latitudeDelta: 1,
          longitudeDelta: 1,
        }}
      >
        <Marker
          latitude={user.location.latitude}
          longitude={user.location.longitude}
          username={user.username}
          name={user.name}
        />
      </Map>
    </Box>
  );
}
