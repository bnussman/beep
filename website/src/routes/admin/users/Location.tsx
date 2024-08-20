import React from 'react';
import { Box, Center } from '@chakra-ui/react';
import { Marker } from '../../../components/Marker';
import { Error } from '../../../components/Error';
import { Map } from '../../../components/Map';
import { createRoute } from '@tanstack/react-router';
import { userRoute } from './User';
import { trpc } from '../../../utils/trpc';
import { Loading } from '../../../components/Loading';

export const locationRoute = createRoute({
  component: LocationView,
  path: 'location',
  getParentRoute: () => userRoute,
});

export function LocationView() {
  const { userId } = locationRoute.useParams();

  const { data: user, isLoading, error } = trpc.user.user.useQuery(userId);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error>{error.message}</Error>;
  }

  if (!user?.location) {
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
            userId={user.id}
            username={user.username}
            photo={user.photo}
            name={`${user.first} ${user.last}`}
            variant="default"
          />
        </Map>
      </div>
    </Box>
  );
}
