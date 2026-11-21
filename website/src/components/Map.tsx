import React from "react";
import { default as _Map } from "react-map-gl/maplibre";
import { useTheme } from "@heroui/react";
import "maplibre-gl/dist/maplibre-gl.css";
import { setWorkerUrl } from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";

setWorkerUrl(workerUrl);

export function Map(props: React.ComponentProps<typeof _Map>) {
  const { resolvedTheme } = useTheme();

  return (
    <_Map
      mapStyle={
        resolvedTheme === "dark" ?
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
