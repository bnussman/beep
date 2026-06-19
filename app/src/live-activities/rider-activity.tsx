import { HStack, Spacer, Text, VStack } from "@expo/ui/swift-ui";
import { font, padding } from "@expo/ui/swift-ui/modifiers";
import { createLiveActivity, type LiveActivityEnvironment } from "expo-widgets";

export interface RiderActivityProps {
  name: string;
  etaMinutes?: number;
  status: string;
}

const RiderActivity = (
  props: RiderActivityProps,
  environment: LiveActivityEnvironment,
) => {
  "widget";

  return {
    banner: (
      <HStack modifiers={[padding({ all: 16 })]} spacing={16}>
        <Text modifiers={[font({ size: 32 })]}>🚕</Text>
        <VStack alignment="leading">
          <Text modifiers={[font({ weight: "heavy" })]}>{props.name}</Text>
          <Text modifiers={[font({ size: 12 })]}>{props.status}</Text>
        </VStack>
        <Spacer />
        {props.etaMinutes !== undefined && (
          <VStack modifiers={[padding({ all: 12 })]}>
            <Text modifiers={[font({ weight: "bold", size: 20 })]}>
              {props.etaMinutes}
            </Text>
            <Text modifiers={[font({ size: 12 })]}>minutes</Text>
          </VStack>
        )}
      </HStack>
    ),
    compactLeading: <Text modifiers={[font({ size: 16 })]}>🚕</Text>,
    compactTrailing: <Text>{props.etaMinutes} min</Text>,
    minimal: <Text modifiers={[font({ size: 16 })]}>🚕</Text>,
    expandedLeading: (
      <VStack modifiers={[padding({ all: 12 })]}>
        <Text modifiers={[font({ size: 32 })]}>🚕</Text>
      </VStack>
    ),
    expandedTrailing:
      props.etaMinutes !== undefined ? (
        <VStack modifiers={[padding({ all: 12 })]}>
          <Text modifiers={[font({ weight: "bold", size: 20 })]}>
            {props.etaMinutes}
          </Text>
          <Text modifiers={[font({ size: 12 })]}>minutes</Text>
        </VStack>
      ) : null,
    expandedBottom: (
      <HStack
        modifiers={[
          padding({ leading: 16, bottom: 12, trailing: 16, vertical: 0 }),
        ]}
      >
        <VStack alignment="leading">
          <Text modifiers={[font({ weight: "heavy" })]}>{props.name}</Text>
          <Text modifiers={[font({ size: 12 })]}>{props.status}</Text>
        </VStack>
        <Spacer />
      </HStack>
    ),
  };
};

export default createLiveActivity("RiderActivity", RiderActivity);
