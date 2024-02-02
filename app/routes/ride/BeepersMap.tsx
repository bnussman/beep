import { Map } from "../../components/Map";
import { useLocation } from "../../utils/useLocation";
import { type Region } from "react-native-maps";
import { useQuery, useSubscription } from "@apollo/client";
import { useEffect } from "react";
import { Text } from "native-base";
import { cache } from "../../utils/Apollo";
import { BEEPER_ICON } from "../../utils/constants";
import { graphql } from "gql.tada";
import { Easing } from "react-native-reanimated"
import { AnimatedMarker, useAnimatedRegion } from "../../components/Marker";

const BeepersLocations = graphql(`
  query GetAllBeepersLocation(
    $radius: Float!
    $longitude: Float!
    $latitude: Float!
  ) {
    getAllBeepersLocation(
      radius: $radius
      longitude: $longitude
      latitude: $latitude
    ) {
      id
      latitude
      longitude
    }
  }
`);

const BeeperLocationUpdates = graphql(`
  subscription GetBeeperLocationUpdates(
    $radius: Float!
    $longitude: Float!
    $latitude: Float!
  ) {
    getBeeperLocationUpdates(
      radius: $radius
      longitude: $longitude
      latitude: $latitude
    ) {
      id
      latitude
      longitude
    }
  }
`);

export function BeepersMap() {
  const { location } = useLocation();
  const { data, startPolling, stopPolling } = useQuery(
    BeepersLocations,
    {
      variables: {
        radius: 20,
        latitude: location?.coords.latitude ?? 0,
        longitude: location?.coords.longitude ?? 0,
      },
      skip: !location,
    }
  );

  const beepers = data?.getAllBeepersLocation;

  useEffect(() => {
    startPolling(15000);
    return () => {
      stopPolling();
    };
  }, []);

  useSubscription(BeeperLocationUpdates, {
    variables: {
      radius: 20,
      latitude: location?.coords.latitude ?? 0,
      longitude: location?.coords.longitude ?? 0,
    },
    skip: !location,
    onData(d) {
      const data = d.data.data?.getBeeperLocationUpdates;
      if (
        data &&
        data.latitude !== null &&
        data.latitude !== undefined &&
        data.longitude !== null &&
        data.longitude !== undefined
      ) {
        cache.modify({
          id: cache.identify({
            __typename: "AnonymousBeeper",
            id: data.id,
          }),
          fields: {
            latitude() {
              return data.latitude!;
            },
            longitude() {
              return data.longitude!;
            },
          },
        });
      }
    },
  });

  const initialRegion: Region | undefined = location
    ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        longitudeDelta: 0.09,
        latitudeDelta: 0.09,
      }
    : undefined;

  return (
    <Map
      showsUserLocation
      style={{
        width: "100%",
        height: 250,
        borderRadius: 15,
        marginTop: 16,
        overflow: "hidden",
      }}
      initialRegion={initialRegion}
    >
      {beepers?.map((beeper) => {
        if (beeper.latitude === null || beeper.longitude === null) {
          return null;
        }

        return (
          <BeeperMarker key={beeper.id} latitude={beeper.latitude} longitude={beeper.longitude} />
        );
      })}
    </Map>
  );
}


interface BeeperMakerProps {
  longitude: number;
  latitude: number;
}

export const BeeperMarker = (props: BeeperMakerProps) => {
  const animatedRegion = useAnimatedRegion(props);

  useEffect(() => {
    animatedRegion.animate({
      latitude: props.latitude,
      longitude: props.longitude,
      duration: 1000,
      easing: Easing.linear
    });
  }, [props])

  return (
    <AnimatedMarker animatedProps={animatedRegion.props}>
      <Text fontSize="2xl">{BEEPER_ICON}</Text>
    </AnimatedMarker>
  );
};
