import { Platform, useColorScheme } from "react-native";
import MapView, { MapViewProps } from "react-native-maps";

export function Map({ children, ...props }: MapViewProps) {
  const colorMode = useColorScheme();

  const userInterfaceStyle = colorMode ? colorMode : undefined;

  const isWeb = Platform.OS === "web";

  const filteredChildren = isWeb ? null : children;

  return (
    <MapView
      userInterfaceStyle={userInterfaceStyle}
      children={filteredChildren}
      {...props}
    />
  );
}
