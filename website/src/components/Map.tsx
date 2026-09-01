import React from "react";
import { default as _Map } from "react-map-gl/maplibre";
import { useColorScheme } from "@mui/material";
import "maplibre-gl/dist/maplibre-gl.css";

export function Map(props: React.ComponentProps<typeof _Map>) {
  const { colorScheme } = useColorScheme();

  return (
    <_Map
      mapStyle={
        colorScheme === "dark" ?
          "https://api.maptiler.com/maps/streets-v4-dark/style.json?key=zrYtedVR6XzXEOMiUlF4" :
          "https://api.maptiler.com/maps/streets-v4/style.json?key=zrYtedVR6XzXEOMiUlF4"
      }
      attributionControl={false}
      style={{
        borderRadius: "16px",
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
