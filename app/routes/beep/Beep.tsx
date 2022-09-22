import React from "react";
import { Unpacked } from "../../utils/constants";
import { openCashApp, openDirections, openVenmo } from "../../utils/links";
import { useUser } from "../../utils/useUser";
import { ActionButton } from "../../components/ActionButton";
import { GetInitialQueueQuery } from "../../generated/graphql";
import { CancelButton } from "../../components/CancelButton";
import { AcceptDenyButton } from "../../components/AcceptDenyButton";
import { Ionicons } from "@expo/vector-icons";
import { Linking } from "react-native";
import { Navigation } from "../../utils/Navigation";
import { printStars } from "../../components/Stars";
import { Avatar } from "../../components/Avatar";
import { useNavigation } from "@react-navigation/native";
import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Menu,
  Pressable,
  Spacer,
  Stack,
  Text,
} from "native-base";
import { Card } from "../../components/Card";

interface Props {
  beep: Unpacked<GetInitialQueueQuery["getQueue"]>;
}

export function Beep(props: Props) {
  const { beep } = props;
  const { user } = useUser();
  const { navigate } = useNavigation<Navigation>();

  return (
    <>
      <Pressable
        onPress={() =>
          navigate("Profile", {
            id: beep.rider.id,
            beep: beep.id,
          })
        }
      >
        <HStack alignItems="center" space={4}>
          <Heading flexShrink={1} fontWeight="extrabold" size="xl">
            {beep.rider.name}
          </Heading>
          <Spacer />
          <Avatar size="xl" url={beep.rider.photo} />
        </HStack>
      </Pressable>
      <Card mt={4}>
        <Stack space={2}>
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
      </Card>
      <Spacer />
      <Stack space={3}>
        {beep.state === 0 ? (
          <>
            <AcceptDenyButton item={beep} type="deny" />
            <AcceptDenyButton item={beep} type="accept" />
          </>
        ) : (
          <>
            <HStack space={2}>
              <Button
                flexGrow={1}
                onPress={() => Linking.openURL("tel:" + beep.rider.phone)}
              >
                Call
              </Button>
              <Button
                flexGrow={1}
                onPress={() => Linking.openURL("sms:" + beep.rider.phone)}
              >
                Text
              </Button>
            </HStack>
            {beep.state > 2 && (
              <>
                {beep.rider.cashapp ? (
                  <Button
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
                    onPress={() =>
                      openVenmo(
                        beep.rider.venmo,
                        beep.groupSize,
                        user?.groupRate,
                        user?.singlesRate,
                        "charge"
                      )
                    }
                  >
                    Request Money from Rider with Venmo
                  </Button>
                ) : null}
              </>
            )}
            {beep.state <= 1 ? (
              <Button
                onPress={() => openDirections("Current+Location", beep.origin)}
              >
                Get Directions to Rider
              </Button>
            ) : (
              <Button
                onPress={() => openDirections(beep.origin, beep.destination)}
              >
                Get Directions for Beep
              </Button>
            )}
            {beep.state < 3 && <CancelButton beep={beep} />}
            <ActionButton beep={beep} />
          </>
        )}
      </Stack>
    </>
  );
}
