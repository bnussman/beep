import React from "react";
import { default as _Map } from "react-map-gl/mapbox";
import { useColorScheme } from "@mui/material";

export function Map(props: React.ComponentProps<typeof _Map>) {
  const { colorScheme } = useColorScheme();

  return (
    <_Map
      mapStyle={
        colorScheme === "light"
          ? "mapbox://styles/mapbox/navigation-day-v1"
          : "mapbox://styles/mapbox/navigation-night-v1"
      }
      mapboxAccessToken="pk.eyJ1IjoiYm51c3NtYW4iLCJhIjoiY2w0ZGhoeGRmMDEwejNjbng0M3NxOW1neSJ9.UwGQ7ZgxmyZAO_yh7hRm4A"
      attributionControl={false}
      style={{
        borderRadius: "25px",
      }}
      initialViewState={{
        latitude: 36.215735,
        longitude: -81.674205,
        zoom: 12,
      }}
      {...props}
    />
  );
}
