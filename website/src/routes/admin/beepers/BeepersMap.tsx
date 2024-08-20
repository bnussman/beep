import React from "react";
import { Box } from "@chakra-ui/react";
import { Marker } from "../../../components/Marker";
import { Map } from "../../../components/Map";
import { BeepersGraphQL } from "./Beepers";
import { RouterOutput } from "../../../utils/trpc";

interface Props {
  beepers: RouterOutput['user']['users']['users'];
  viewState?: { latitude: number, longitude: number, zoom: number };
}

export function BeepersMap({ beepers }: Props) {

  return (
    <Box mb={4} mt={4} height="575px" width="100%">
      <Map
        initialViewState={{
          latitude: 36.215735,
          longitude: -81.674205,
          zoom: 12,
        }}
      >
        {beepers.map((beeper) => (
          <Marker
            key={beeper.id}
            latitude={beeper.location?.latitude || 0}
            longitude={beeper.location?.longitude || 0}
            userId={beeper.id}
            photo={beeper.photo}
            name={`${beeper.first} ${beeper.last}`}
            username={beeper.username}
            variant='queue'
          />
        ))}
      </Map>
    </Box>
  );
}
