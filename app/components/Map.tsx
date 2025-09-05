import { useColorScheme } from "react-native";
import MapView, { MapViewProps } from "react-native-maps";

interface Props extends MapViewProps {
  ref?: React.RefObject<MapView | null>;
}

export function Map(props: Props) {
  const colorScheme = useColorScheme();

  return <MapView userInterfaceStyle={colorScheme ?? "light"} {...props} />;
}
