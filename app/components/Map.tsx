import { useColorScheme } from "react-native";
import MapView, { MapViewProps } from "react-native-maps";

export function Map(props: MapViewProps) {
  const colorScheme = useColorScheme();

  return <MapView userInterfaceStyle={colorScheme ?? "light"} {...props} />;
}
