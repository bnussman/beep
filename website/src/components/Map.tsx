import React from 'react';
import { default as _Map, MapProps } from 'react-map-gl';
import { useColorMode } from '@chakra-ui/react';

export function Map(props: MapProps) {
  const { colorMode } = useColorMode();

  return (
    <_Map
      mapStyle={colorMode === 'light' ? "mapbox://styles/mapbox/navigation-day-v1" : "mapbox://styles/mapbox/navigation-night-v1"}
      mapboxAccessToken="pk.eyJ1IjoiYm51c3NtYW4iLCJhIjoiY2w0ZGhoeGRmMDEwejNjbng0M3NxOW1neSJ9.UwGQ7ZgxmyZAO_yh7hRm4A"
      attributionControl={false}
      style={{
        borderRadius: "25px"
      }}
      initialViewState={{
        latitude: 36.215735,
        longitude: -81.674205,
        zoom: 12,
      }}
      {...props}
    />
  );
};
