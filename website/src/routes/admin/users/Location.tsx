import React, { useEffect } from 'react';
import { gql } from '@apollo/client';
import { Box, Center } from '@chakra-ui/react';
import { GetUserQuery, User } from '../../../generated/graphql';
import { client } from '../../../utils/Apollo';
import { GetUser } from './User';
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

    console.log("subbing")
    sub = a.subscribe(({ data }) => {
      client.writeQuery({
        query: GetUser,
        data: {
          getUser: {
            ...user,
            location: {
              latitude: data.getLocationUpdates.latitude,
              longitude: data.getLocationUpdates.longitude,
            }
          }
        },
        variables: {
          id: user.id
        }
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
    <Box>
      <div style={{ height: 550, width: '100%' }}>
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
            user={user as User}
            variant="default"
          />
        </Map>
      </div>
    </Box>
  );
}