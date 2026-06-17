import { Image, Text, VStack } from "@expo/ui/swift-ui";
import { font, foregroundStyle, padding } from "@expo/ui/swift-ui/modifiers";
import { createLiveActivity, type LiveActivityEnvironment } from "expo-widgets";

interface RiderActivityProps {
  name: string;
  etaMinutes: string;
  status: string;
}

const RiderActivity = (
  props: RiderActivityProps,
  environment: LiveActivityEnvironment,
) => {
  "widget";
  const accentColor =
    environment.colorScheme === "dark" ? "#FFFFFF" : "#007AFF";

  return {
    banner: (
      <VStack modifiers={[padding({ all: 12 })]}>
        <Text>{props.name}</Text>
        <Text
          modifiers={[font({ weight: "bold" }), foregroundStyle(accentColor)]}
        >
          {props.status}
        </Text>
        <Text>Estimated arrival: {props.etaMinutes} minutes</Text>
      </VStack>
    ),
    compactLeading: <Image systemName="box.truck.fill" color={accentColor} />,
    compactTrailing: <Text>{props.etaMinutes} min</Text>,
    minimal: <Image systemName="box.truck.fill" color={accentColor} />,
    expandedLeading: (
      <VStack modifiers={[padding({ all: 12 })]}>
        <Image systemName="box.truck.fill" color={accentColor} />
        <Text modifiers={[font({ size: 12 })]}>{props.status}</Text>
      </VStack>
    ),
    expandedTrailing: (
      <VStack modifiers={[padding({ all: 12 })]}>
        <Text modifiers={[font({ weight: "bold", size: 20 })]}>
          {props.etaMinutes}
        </Text>
        <Text modifiers={[font({ size: 12 })]}>minutes</Text>
      </VStack>
    ),
    expandedBottom: (
      <VStack modifiers={[padding({ all: 12 })]}>
        <Text>Driver: {props.name}</Text>
        <Text>ETA: {props.etaMinutes} min</Text>
      </VStack>
    ),
  };
};

export default createLiveActivity("RiderActivity", RiderActivity);
