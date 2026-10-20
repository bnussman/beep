import {
  HStack,
  Spacer,
  Text,
  VStack,
  ProgressView,
} from "@expo/ui/swift-ui";
import {
  font,
  padding,
  foregroundStyle,
  progressViewStyle,
  background,
} from "@expo/ui/swift-ui/modifiers";
import { createLiveActivity, type LiveActivityEnvironment } from "expo-widgets";
import React from "react";

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

  const getHeading = () => {
    switch (props.status) {
      case "waiting":
        return "Waiting on Beeper";
      case "accepted":
        return "Ride Accepted";
      case "on_the_way":
        return "Beeper is on the way";
      case "here":
        return "Beeper is here";
      case "in_progress":
        return "Beep In Progress";
      default:
        return "Unknown";
    }
  };

  const getSubHeading = () => {
    switch (props.status) {
      case "waiting":
        return `Waiting on ${props.name} to accept or deny`;
      case "accepted": {
        if (props.positionInQueue === 0) {
          return `${props.name} will be on the way soon`;
        }
        return `You are in ${props.name}'s rider queue`;
      }
      case "on_the_way":
        return `${props.name} is on the way in a ${props.car?.color} ${props.car?.make} ${props.car?.model}`;
      case "here":
        return `${props.name} is here in a ${props.car?.color} ${props.car?.make} ${props.car?.model}`;
      case "in_progress":
        return `Your ride with ${props.name} is in progress`;
      default:
        return "Unknown";
    }
  };

  const getProgressValue = () => {
    switch (props.status) {
      case "waiting":
        return 0.2;
      case "accepted":
        return 0.4;
      case "on_the_way":
        return 0.6;
      case "here":
        return 0.8;
      case "in_progress":
        return 0.9;
      default:
        return 0;
    }
  };

  const renderProgressBar = () => (
    <ProgressView
      value={getProgressValue()}
      modifiers={[progressViewStyle("linear"), foregroundStyle('#4285ea'), background('#7e7e7e')]}
    />
  );

  return {
    banner: (
      <HStack modifiers={[padding({ all: 16 })]} spacing={8}>
        <VStack  alignment="leading" spacing={16}>
          <VStack spacing={8} alignment="leading">
            <HStack spacing={8} >
              <Text modifiers={[font({ size: 18 })]}>🚕</Text>
              <Text modifiers={[font({ size: 18, weight: "heavy" })]}>{getHeading()}</Text>
            </HStack>
            <Text modifiers={[font({ size: 12 })]}>{getSubHeading()}</Text>
          </VStack>
          {renderProgressBar()}
        </VStack>
        {props.status === "here" ? (
          <React.Fragment>
            <Spacer />
            <Text modifiers={[font({ size: 24 })]}>👋🏼</Text>
          </React.Fragment>
        ) : props.etaMinutes !== undefined ? (
          <React.Fragment>
            <Spacer />
            <VStack modifiers={[padding({ all: 12 })]}>
              <Text modifiers={[font({ weight: "bold", size: 20 })]}>
                {props.etaMinutes}
              </Text>
              <Text modifiers={[font({ size: 12 })]}>minutes</Text>
            </VStack>
          </React.Fragment>
        ) : null}
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
      props.status === "accepted" && props.positionInQueue > 0 ? (
        <VStack modifiers={[padding({ all: 12 })]}>
          <Text modifiers={[font({ weight: "bold", size: 20 })]}>
            {props.positionInQueue}
          </Text>
          <Text modifiers={[font({ size: 10 })]}>riders ahead</Text>
        </VStack>
      ) : props.etaMinutes !== undefined ? (
        <VStack modifiers={[padding({ all: 12 })]}>
          <Text modifiers={[font({ weight: "bold", size: 20 })]}>
            {props.etaMinutes}
          </Text>
          <Text modifiers={[font({ size: 12 })]}>minutes</Text>
        </VStack>
      ) : null,
    expandedBottom: (
      <VStack alignment="leading" modifiers={[padding({ bottom: 16 })]} spacing={16}>
        <VStack alignment="leading">
          <Text modifiers={[font({ size: 18, weight: "heavy" })]}>{getHeading()}</Text>
          <Text modifiers={[font({ size: 12 })]}>{getSubHeading()}</Text>
        </VStack>
        {renderProgressBar()}
      </VStack>
    ),
  };
};

export default createLiveActivity("RiderActivity", RiderActivity);
