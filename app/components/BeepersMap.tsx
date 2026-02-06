import { Map } from "./Map";
import { useLocation } from "../utils/location";
import { type Region } from "react-native-maps";
import { AnimatedMarker } from "./AnimatedMarker";
import { useTRPC } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";
import { useQueryClient } from "@tanstack/react-query";

export function BeepersMap() {
  const trpc = useTRPC();
  const { location } = useLocation();
  const queryClient = useQueryClient();

  const input = {
    latitude: location?.coords.latitude ?? 0,
    longitude: location?.coords.longitude ?? 0,
  };

  const { data: beepers } = useQuery(
    trpc.rider.beepersNearMe.queryOptions(input, {
      enabled: location !== undefined,
      refetchInterval: 15_000,
    }),
  );

  useSubscription(
    trpc.rider.beepersLocations.subscriptionOptions(input, {
      enabled: location !== undefined,
      onData(locationUpdate) {
        console.log(locationUpdate);
        queryClient.setQueryData(
          trpc.rider.beepersNearMe.queryKey(input),
          (prev) => {
            if (!prev) {
              return undefined;
            }

            const indexOfItem = prev.findIndex(
              (beeper) => beeper.id === locationUpdate.id,
            );

            if (indexOfItem !== -1) {
              const newData = [...prev];
              newData[indexOfItem] = {
                ...prev[indexOfItem],
                location: locationUpdate.location,
              };
              return newData;
            }
          },
        );
      },
    }),
  );

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
