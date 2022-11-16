import React, { useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { GetBeepersQuery } from "../../../generated/graphql";
import { Marker } from "../../../components/Marker";
import { Map } from "../../../components/Map";
import { MapRef } from "react-map-gl";

interface Props {
  beepers: GetBeepersQuery['getBeepers'];
  viewState?: { latitude: number, longitude: number, zoom: number };
}

export function BeepersMap(props: Props) {
  const { beepers, viewState } = props;
  const mapRef = React.useRef<MapRef>();

  useEffect(() => {
    if (viewState) {
      mapRef.current?.setCenter({ lat: viewState.latitude, lon: viewState. longitude });
      mapRef.current?.setZoom(viewState.zoom);
    }
  }, [viewState])

  return (
    <Box mb={4} mt={4} height={450} width='100%'>
      <Map
        ref={mapRef}
        initialViewState={viewState ?? {
          latitude: 36.215735,
          longitude: -81.674205,
          zoom: 12,
        }}
      >
        {beepers?.map((beeper) => (
          <Marker
            key={beeper.id}
            latitude={beeper.location?.latitude || 0}
            longitude={beeper.location?.longitude || 0}
            userId={beeper.id}
            photo={beeper.photo}
            name={beeper.name}
            username={beeper.username}
            variant='queue'
          />
        ))}
      </Map>
    </Box>
  );
}