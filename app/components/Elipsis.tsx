import { Text } from "./Text";
import { View } from "react-native";

export function Elipsis() {
  return (
    <View style={{ transform: [{ translateY: -14 }] }}>
      <Text size="4xl">...</Text>
    </View>
  );
}
