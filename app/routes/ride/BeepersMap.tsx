import { Map } from "../../components/Map";
import { useLocation } from "../../utils/location";
import { type Region } from "react-native-maps";
import { BeeperMarker } from "../../components/Marker";
import { trpc } from "@/utils/trpc";

export function BeepersMap() {
  const { location } = useLocation();
  const utils = trpc.useUtils();

  const input = {
    latitude: location?.coords.latitude ?? 0,
    longitude: location?.coords.longitude ?? 0,
  };

  const { data: beepers } = trpc.rider.beepersNearMe.useQuery(
    input,
    {
      enabled: location !== undefined,
      refetchInterval: 15_000
    }
  );

  trpc.rider.beepersLocations.useSubscription(
    input,
    {
      enabled: location !== undefined,
      onData(locationUpdate) {
        console.log(locationUpdate)
        utils.rider.beepersNearMe.setData(input, (prev) => {
          if (!prev) {
            return undefined;
          }

          const indexOfItem = prev.findIndex(beeper => beeper.id === locationUpdate.id)

          if (indexOfItem !== -1)  {
            const newData = [...prev];
            newData[indexOfItem] = { ...prev[indexOfItem], location: locationUpdate.location };
            return newData;
          }
        });
      }
    }
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
          <BeeperMarker key={beeper.id} latitude={beeper.location.latitude} longitude={beeper.location.longitude} />
        );
      })}
    </Map>
  );
}
