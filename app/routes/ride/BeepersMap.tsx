import { Map } from "../../components/Map";
import { useLocation } from "../../utils/useLocation";
import { Region } from "react-native-maps";

export function BeepersMap() {
  const { location } = useLocation();

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
    />
  );
}
