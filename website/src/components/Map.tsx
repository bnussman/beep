import React from "react";
import { default as _Map } from "react-map-gl/maplibre";
import { useColorScheme } from "@mui/material";

const getStyle = (theme: "light" | "dark") => ({
  version: 8 as const,
  metadata: {},
  sources: {
    osm: {
      type: "raster" as const,
      tiles:
        theme === "dark"
          ? ["https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"]
          : ["https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"],
      tileSize: 256,
    },
  },
  layers: [
    {
      id: "tiles-layer",
      type: "raster" as const,
      source: "osm",
    },
  ],
});

export function Map(props: React.ComponentProps<typeof _Map>) {
  const { colorScheme } = useColorScheme();

  return (
    <_Map
      mapStyle={getStyle(colorScheme ?? "light")}
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
