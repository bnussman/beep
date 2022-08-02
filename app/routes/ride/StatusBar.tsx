import React from "react";
import { Text, Slider } from "native-base";

interface Props {
  state: number;
}

export function StatusBar({ state }: Props) {
  const iconMap = ["⏱", "🚕", "📍", "🚕"];

  return (
    <Slider
      w="100%"
      value={state}
      minValue={0}
      maxValue={4}
      step={1}
      isDisabled
      _disabled={{ opacity: 1 }}
      height="50px"
    >
      <Slider.Track height="50px">
        <Slider.FilledTrack />
      </Slider.Track>
      <Slider.Thumb
        height="50px"
        width="40px"
        ml={-2}
        borderWidth="0"
        bg="transparent"
      >
        <Text fontSize="3xl">{iconMap[state] ?? "🍆"}</Text>
      </Slider.Thumb>
    </Slider>
  );
}
