import { Map } from "./Map";
import { useLocation } from "@/utils/location";
import { type Region } from "react-native-maps";
import { AnimatedMarker } from "./AnimatedMarker";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { useSubscription } from "@/utils/subscriptions";
import { useIsFocused } from "expo-router";

export function BeepersMap() {
  const { location } = useLocation();
  const queryClient = useQueryClient();
  const isFocused = useIsFocused();

  const input = {
    latitude: location?.coords.latitude ?? 0,
    longitude: location?.coords.longitude ?? 0,
  };

  const { data: beepers } = useQuery(
    orpc.rider.beepersNearMe.queryOptions({
      input,
      enabled: location !== undefined,
      refetchInterval: 15_000,
    }),
  );

  useSubscription({
    ...orpc.rider.beepersLocations.liveOptions({
      input,
      enabled: location !== undefined && isFocused,
      context: { ws: true }
    }),
    onData(data) {
      queryClient.setQueryData(
        orpc.rider.beepersNearMe.queryKey({ input }),
        (prev) => {
          if (!prev) {
            return undefined;
          }

          const indexOfItem = prev.findIndex(
            (beeper) => beeper.id === data.id,
          );

          if (indexOfItem !== -1) {
            const newData = [...prev];
            newData[indexOfItem] = {
              ...prev[indexOfItem],
              location: data.location,
            };
            return newData;
          }
        },
      );
    }
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
        minHeight: 250,
        flex: 1,
        borderRadius: 15,
        overflow: "hidden",
      }}
      initialRegion={initialRegion}
    >
      {beepers?.map((beeper) => {
        if (!beeper.location) {
          return null;
        }

        return (
          <AnimatedMarker
            key={beeper.id}
            latitude={beeper.location.latitude}
            longitude={beeper.location.longitude}
          />
        );
      })}
    </Map>
  );
}
