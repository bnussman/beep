import { Map } from "../../components/Map";
import { useLocation } from "../../utils/useLocation";
import { AnimatedRegion, MarkerAnimated, Region } from "react-native-maps";
import { gql, useQuery } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { Text } from "native-base";
import { Platform } from "react-native";
import {
  AnonymousBeeper,
  GetAllBeepersLocationQuery,
} from "../../generated/graphql";

const BeepersLocations = gql`
  query GetAllBeepersLocation {
    getAllBeepersLocation {
      id
      latitude
      longitude
    }
  }
`;

export function BeepersMap() {
  const { location } = useLocation();
  const { data, startPolling, stopPolling } =
    useQuery<GetAllBeepersLocationQuery>(BeepersLocations);

  const beepers = data?.getAllBeepersLocation;

  useEffect(() => {
    startPolling(10000);
    return () => {
      stopPolling();
    };
  }, []);

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
      style={{ width: "100%", height: 250, borderRadius: 15 }}
      initialRegion={initialRegion}
    >
      {beepers?.map((beeper) => {
        return <BeeperMarker key={beeper.id} {...beeper} />;
      })}
    </Map>
  );
}

const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;

function BeeperMarker({ id, latitude, longitude }: AnonymousBeeper) {
  const ref = useRef<MarkerAnimated>(null);
  const [coordinate] = useState(
    new AnimatedRegion({
      latitude: latitude ?? 0,
      longitude: longitude ?? 0,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    })
  );

  useEffect(() => {
    if (Platform.OS === "android") {
      if (ref?.current) {
        ref.current.animateMarkerToCoordinate(
          { latitude: latitude ?? 0, longitude: longitude ?? 0 },
          1000
        );
      }
    } else {
      coordinate
        .timing({
          latitude: latitude ?? 0,
          longitude: longitude ?? 0,
          duration: 1000,
          useNativeDriver: false,
        })
        .start();
    }
  }, [latitude, longitude]);

  return (
    <MarkerAnimated ref={ref} coordinate={coordinate}>
      <Text>🚕</Text>
    </MarkerAnimated>
  );
}
