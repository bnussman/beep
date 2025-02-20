import React, { useEffect, useRef } from "react";
import { Text } from "@/components/Text";
import { BEEPER_ICON } from "../utils/constants";
import { MapMarker, Marker } from 'react-native-maps';
import {
  runOnJS,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface BeeperMakerProps {
  longitude: number;
  latitude: number;
}

export const BeeperMarker = (props: BeeperMakerProps) => {
  const markerRef = useRef<MapMarker>(null);
  // Shared values for latitude and longitude
  const latitude = useSharedValue(props.latitude);
  const longitude = useSharedValue(props.longitude);

  // Derived value to trigger marker updates
  const updateMarkerPosition = (lat: number, lng: number) => {
    if (markerRef && markerRef.current) {
      markerRef.current.setNativeProps({
        coordinate: {latitude: lat, longitude: lng},
      });
    }
  };

  useEffect(() => {
    latitude.value = withTiming(props.latitude, { duration: 1000 });
    longitude.value = withTiming(props.longitude, { duration: 1000 });
  }, [props]);

  // Use useDerivedValue to react to changes in latitude and longitude
  useDerivedValue(() => {
    const lat = latitude.value;
    const lng = longitude.value;
    // Use runOnJS to call updateMarkerPosition from the UI thread
    // runOnJS requires functions to be called with their arguments
    runOnJS(updateMarkerPosition)(lat, lng);
  }, [latitude, longitude]);

  return (
    <Marker
      ref={markerRef}
      coordinate={{ latitude: latitude.value, longitude: longitude.value }}
    >
      <Text size="3xl">{BEEPER_ICON}</Text>
    </Marker>
  );
};
