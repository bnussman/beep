import { Text } from "@/components/Text";
import { View } from "react-native";
import { Countdown } from "./CountDown";

interface Props {
  eta: Date | null;
}

export function ETA(props: Props) {

  const renderBody = () => {
    if (props.eta) {
      const pickUpAt = props.eta.toLocaleTimeString([], { timeStyle: 'short' });

      return (
        <Text>
          Pick up <Countdown date={props.eta} /> ({pickUpAt})
        </Text>
      );
    }

    return "N/A";
  };

  return (
    <View>
      <Text weight="800">ETA</Text>
      <Text>{renderBody()}</Text>
    </View>
  );
}
