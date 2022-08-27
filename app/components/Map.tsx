import { useColorMode } from "native-base";
import MapView, { MapViewProps } from "react-native-maps";

export function Map(props: MapViewProps) {
  const { colorMode } = useColorMode();

  const userInterfaceStyle = colorMode ? colorMode : undefined;

  return <MapView userInterfaceStyle={userInterfaceStyle} {...props} />;
}
