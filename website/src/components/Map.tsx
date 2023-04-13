import React from 'react';
import { Map as _Map, ColorScheme, MapProps } from 'mapkit-react';
import { useColorMode } from '@chakra-ui/react';

const token = import.meta.env.PROD ?
"eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlRESFU1S1BINjUifQ.eyJpc3MiOiI4MjQ0OUNBWDlSIiwiaWF0IjoxNjgwNzQ3ODcxLCJleHAiOjE3MTIyNzUyMDAsIm9yaWdpbiI6Imh0dHBzOi8vcmlkZWJlZXAuYXBwIn0.NHUosL1PE9B1Ta5BgH7Jk5qLfUytAa9Iio1kOzG2n1L6N-bsCjA7GncszYTWY3fnhw7Kzoru2mAQLcKAdCKa7w"
: "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlRESFU1S1BINjUifQ.eyJpc3MiOiI4MjQ0OUNBWDlSIiwiaWF0IjoxNjgwNzQ3ODMxLCJleHAiOjE3MTIyNzUyMDAsIm9yaWdpbiI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTE3MyJ9.5M8fxffAMIxonkFqsAnG9WrQzHfn48HqUN-wukqNKDRWvEuo9FoeP4BGcVtA5wM2FG1LyUyS_Fl6PMZfb6WWWw";

export const Map = (props: Partial<MapProps> & { children: React.ReactNode }) => {
  const { colorMode } = useColorMode();

  return (
    <_Map
      token={token}
      allowWheelToZoom
      colorScheme={colorMode === 'light' ? ColorScheme.Light : ColorScheme.Dark}
      initialRegion={{
        centerLatitude: 36.215735,
        centerLongitude: -81.674205,
        latitudeDelta: 5,
        longitudeDelta: 5,
      }}
      {...props}
    >
      {props.children}
    </_Map>
  );
};
