import { Text } from "@/components/Text";
import { View } from "react-native";

interface Props {
  eta: string | null;
}

export function ETA(props: Props) {
  return (
    <View>
      <Text weight="800">ETA</Text>
      <Text>{props.eta ?? "N/A"}</Text>
    </View>
  );
}
