import React, { useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import { gql } from '@apollo/client';
import { Box, Center } from '@chakra-ui/react';
import { GetUserQuery } from '../../../generated/graphql';
import { client } from '../../../utils/Apollo';
import { GetUser } from './User';
import { Marker } from '../../../components/Marker';

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
      <div style={{ height: 650, width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyBgabJrpu7-ELWiUIKJlpBz2mL6GYjwCVI' }}
          defaultCenter={{ lat: user.location.latitude, lng: user.location.longitude }}
          defaultZoom={15}
          center={{ lat: user.location.latitude, lng: user.location.longitude }}
        >
          <Marker
            lat={user.location.latitude}
            lng={user.location.longitude}
            text={user.name}
            photoUrl={user.photoUrl}
          />
        </GoogleMapReact>
      </div>
    </Box>
  );
}