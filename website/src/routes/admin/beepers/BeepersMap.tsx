import React from "react";
import { Box } from "@chakra-ui/react";
import { GetBeepersQuery } from "../../../generated/graphql";
import { Marker } from "../../../components/Marker";
import { Map } from "../../../components/Map";

interface Props {
  beepers: GetBeepersQuery['getBeepers'];
}

export function BeepersMap(props: Props) {
  const { beepers } = props;

  return (
    <Box mb={4} mt={4} height={600} width='100%' borderRadius="20px" overflow="hidden">
      <Map>
        {beepers?.map((beeper) => (
          <Marker
            key={beeper.id}
            latitude={beeper.location?.latitude || 0}
            longitude={beeper.location?.longitude || 0}
            name={beeper.name}
            username={beeper.username}
          />
        ))}
      </Map>
    </Box>
  );
}