import React from "react";
import { Unpacked } from "../../utils/constants";
import { openCashApp, openVenmo } from "../../utils/links";
import { useUser } from "../../utils/useUser";
import { ActionButton } from "../../components/ActionButton";
import { GetInitialQueueQuery } from "../../generated/graphql";
import { printStars } from "../../components/Stars";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Spacer,
  Stack,
  Text,
} from "native-base";
import { CancelButton } from "../../components/CancelButton";
import { AcceptDenyButton } from "../../components/AcceptDenyButton";

interface Props {
  beep: Unpacked<GetInitialQueueQuery["getQueue"]>;
}

export function Beep(props: Props) {
  const { beep } = props;
  const { user } = useUser();

  return (
    <Flex w="100%" height="80%" px={6} py={4}>
      <HStack alignItems="center" space={4}>
        <Stack>
          <Heading fontWeight="extrabold" size="xl">
            {beep.rider.name}
          </Heading>
          <Text fontSize="xs">
            {beep.rider.rating !== null && beep.rider.rating !== undefined
              ? printStars(beep.rider.rating)
              : null}
          </Text>
        </Stack>
        <Spacer />
        <Avatar
          size="xl"
          source={
            beep.rider.photoUrl ? { uri: beep.rider.photoUrl } : undefined
          }
        />
      </HStack>
      <Stack space={2} mt={4}>
        <Box>
          <Heading size="sm" fontWeight="extrabold">
            Group Size
          </Heading>
          <Text>{beep.groupSize}</Text>
        </Box>
        <Box>
          <Heading size="sm" fontWeight="extrabold">
            Pick Up
          </Heading>
          <Text>{beep.origin}</Text>
        </Box>
        <Box>
          <Heading size="sm" fontWeight="extrabold">
            Destination
          </Heading>
          <Text>{beep.destination}</Text>
        </Box>
      </Stack>
      <Spacer />
      <Stack space={3}>
        {!beep.isAccepted ? (
          <>
            <AcceptDenyButton item={beep} type="deny" />
            <AcceptDenyButton item={beep} type="accept" />
          </>
        ) : (
          <>
            {beep.rider.cashapp ? (
              <Button
                colorScheme="green"
                variant="subtle"
                onPress={() =>
                  openCashApp(
                    beep.rider.cashapp,
                    beep.groupSize,
                    user?.groupRate,
                    user?.singlesRate
                  )
                }
              >
                Request Money from Rider with Cash App
              </Button>
            ) : null}
            {beep.rider?.venmo ? (
              <Button
                colorScheme="blue"
                variant="subtle"
                onPress={() =>
                  openVenmo(
                    beep.rider.venmo,
                    beep.groupSize,
                    user?.groupRate,
                    user?.singlesRate
                  )
                }
              >
                Request Money from Rider with Venmo
              </Button>
            ) : null}
            <CancelButton item={beep} />
            <ActionButton item={beep} />
          </>
        )}
      </Stack>
    </Flex>
  );
}
