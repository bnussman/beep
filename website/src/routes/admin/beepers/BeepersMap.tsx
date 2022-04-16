import React from "react";
import GoogleMapReact from 'google-map-react';
import { Box } from "@chakra-ui/react";
import { User } from "../../../generated/graphql";
import { Marker } from "../../../components/Marker";

interface Props {
  beepers: User[] | undefined;
}

const center = {
  lat: 36.215735,
  lng: -81.674205
};

export function BeepersMap(props: Props) {
  const { beepers } = props;

  return (
    <Box mb={4} mt={4} height={450} width='100%'>
      <GoogleMapReact
        bootstrapURLKeys={{ key: import.meta.env.VITE_GOOGLE_API_KEY || '' }}
        defaultCenter={center}
        defaultZoom={13}
      >
        {beepers?.map((beeper: User) => (
          <Marker
            key={beeper.id}
            lat={beeper.location?.latitude || 0}
            lng={beeper.location?.longitude || 0}
            text={beeper.name}
            photoUrl={beeper.photoUrl}
          />
        ))}
      </GoogleMapReact>
    </Box>
  );
}