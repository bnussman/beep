import { HStack, Spacer, Text, VStack, Circle } from "@expo/ui/swift-ui";
import {
  font,
  padding,
  foregroundStyle,
  frame,
} from "@expo/ui/swift-ui/modifiers";
import { createLiveActivity, type LiveActivityEnvironment } from "expo-widgets";

export interface RiderActivityProps {
  name: string;
  etaMinutes?: number;
  status: string;
  positionInQueue: number;
  car?: { make: string; model: string; color: string };
}

const RiderActivity = (
  props: RiderActivityProps,
  environment: LiveActivityEnvironment,
) => {
  "widget";

  const getCurrentStatusMessage = () => {
    switch (props.status) {
      case "waiting":
        return "Waiting for beeper to accept or deny you.";
      case "accepted":
        return "Beeper is getting ready to come get you. They will be on the way soon.";
      case "on_the_way":
        return "Beeper is on their way to get you.";
      case "here":
        return `Beeper is here to pick you up.`;
      case "in_progress":
        return "You are currently in the car with your beeper.";
      default:
        return "Unknown";
    }
  };

  const colorMap = {
    red: "#ca3f3f",
    green: "#62be62",
    blue: "#4285ea",
    purple: "#a837b7",
    black: "#2b2b2b",
    gray: "#a8a8a8",
    pink: "#d36ecb",
    white: "#e2e2e2",
    orange: "#d8670a",
    tan: "#c69567",
    brown: "#78513edd",
    silver: "#7e7e7e",
    yellow: "#ffc72f",
  };

  const capitalize = (s: string) => {
    return `${s.charAt(0).toUpperCase()}${s.slice(1, s.length)}`;
  };

  return {
    banner: (
      <HStack modifiers={[padding({ all: 16 })]} spacing={16}>
        <Text modifiers={[font({ size: 32 })]}>🚕</Text>
        <VStack alignment="leading">
          <Text modifiers={[font({ weight: "heavy" })]}>{props.name}</Text>
          <Text modifiers={[font({ size: 12 })]}>
            {getCurrentStatusMessage()}
          </Text>
          {props.car && (
            <HStack spacing={8}>
              <Text modifiers={[font({ size: 12 })]}>
                {capitalize(props.car.color)} {props.car.make} {props.car.model}
              </Text>
              <Circle
                modifiers={[
                  foregroundStyle(
                    colorMap[props.car.color as keyof typeof colorMap] ??
                      "#fffff",
                  ),
                  frame({ width: 12, height: 12 }),
                ]}
              />
            </HStack>
          )}
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
    compactTrailing:
      props.status === "here" ? (
        <Text modifiers={[font({ size: 16 })]}>👋🏼</Text>
      ) : props.etaMinutes !== undefined ? (
        <Text>{props.etaMinutes} min</Text>
      ) : null,
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
          <Text modifiers={[font({ size: 12 })]}>
            {getCurrentStatusMessage()}
          </Text>
          {props.car && (
            <HStack spacing={8}>
              <Text modifiers={[font({ size: 12 })]}>
                {capitalize(props.car.color)} {props.car.make} {props.car.model}
              </Text>
              <Circle
                modifiers={[
                  foregroundStyle(
                    colorMap[props.car.color as keyof typeof colorMap] ??
                      "#fffff",
                  ),
                  frame({ width: 12, height: 12 }),
                ]}
              />
            </HStack>
          )}
        </VStack>
        <Spacer />
      </HStack>
    ),
  };
};

export default createLiveActivity("RiderActivity", RiderActivity);
