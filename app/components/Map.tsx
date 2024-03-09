import { Platform, useColorScheme } from "react-native";
import MapView, { MapViewProps } from "react-native-maps";

export function Map({ children, ...props }: MapViewProps) {
  const colorScheme = useColorScheme();

  const isWeb = Platform.OS === "web";

  const filteredChildren = isWeb ? null : children;

  return (
    <MapView
      userInterfaceStyle={colorScheme ?? "light"}
      children={filteredChildren}
      {...props}
    />
  );
}
