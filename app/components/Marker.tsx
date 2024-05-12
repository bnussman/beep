import React, { useCallback, useEffect } from "react";
import { Text } from "@/components/Text";
import { Marker, MapMarkerProps } from "react-native-maps";
import { BEEPER_ICON } from "../utils/constants";
import Animated, {
  Easing,
  EasingFn,
  EasingFunctionFactory,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface LatLng {
  latitude: number;
  longitude: number;
  longitudeDelta?: number;
  latitudeDelta?: number;
}

interface AnimateOptions extends LatLng {
  duration?: number;
  easing?: EasingFn | EasingFunctionFactory;
}

export const useAnimatedRegion = (location: Partial<LatLng> = {}) => {
  const latitute = useSharedValue(location.latitude);
  const longitude = useSharedValue(location.longitude);
  const latitudeDelta = useSharedValue(location.latitudeDelta);
  const longitudeDelta = useSharedValue(location.longitudeDelta);

  const animatedProps = useAnimatedProps(() => ({
    coordinate: {
      latitude: latitute.value ?? 0,
      longitude: longitude.value ?? 0,
      latitudeDelta: latitudeDelta.value ?? 0,
      longitudeDelta: longitudeDelta.value ?? 0,
    },
  }));

  const animate = useCallback(
    (options: AnimateOptions) => {
      const { duration = 500, easing = Easing.inOut(Easing.ease) } = options;

      const animateValue = (
        value: Animated.SharedValue<number | undefined>,
        toValue?: number,
      ) => {
        if (!toValue) {
          return;
        }

        value.value = withTiming(toValue, {
          duration,
          easing,
        });
      };

      animateValue(latitute, options.latitude);
      animateValue(longitude, options.longitude);
      animateValue(latitudeDelta, options.latitudeDelta);
      animateValue(longitudeDelta, options.longitudeDelta);
    },
    [latitute, longitude, latitudeDelta, longitudeDelta],
  );

  return {
    props: animatedProps,
    animate,
  };
};

type MarkerProps = Omit<MapMarkerProps, "coordinate"> & {
  coordinate?: MapMarkerProps["coordinate"];
};

export const AnimatedMarker = Animated.createAnimatedComponent(
  Marker as React.ComponentClass<MarkerProps>,
);

interface BeeperMakerProps {
  longitude: number;
  latitude: number;
}

export const BeeperMarker = ({ latitude, longitude }: BeeperMakerProps) => {
  const animatedRegion = useAnimatedRegion({
    latitude,
    longitude,
  });

  useEffect(() => {
    animatedRegion.animate({
      latitude,
      longitude,
      duration: 1000,
      easing: Easing.linear,
    });
  }, [latitude, longitude]);

  return (
    <AnimatedMarker animatedProps={animatedRegion.props}>
      <Text size="3xl">{BEEPER_ICON}</Text>
    </AnimatedMarker>
  );
};
