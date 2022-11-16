import React from 'react';
import { default as _Map, MapRef } from 'react-map-gl';
import { useColorMode } from '@chakra-ui/react';

export const Map = React.forwardRef((props: any, ref: any) => {
  const { colorMode } = useColorMode();

  return (
    <_Map
      ref={ref}
      mapStyle={colorMode === 'light' ? "mapbox://styles/mapbox/light-v10" : "mapbox://styles/mapbox/dark-v10"}
      mapboxAccessToken="pk.eyJ1IjoiYm51c3NtYW4iLCJhIjoiY2w0ZGhoeGRmMDEwejNjbng0M3NxOW1neSJ9.UwGQ7ZgxmyZAO_yh7hRm4A"
      attributionControl={false}
      initialViewState={{
        latitude: 36.215735,
        longitude: -81.674205,
        zoom: 12,
      }}
      {...props}
    >
      {props.children}
    </_Map>
  );
});
