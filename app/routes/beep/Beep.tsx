import React from "react";
import { Unpacked } from "../../utils/constants";
import { openCashApp, openDirections, openVenmo } from "../../utils/links";
import { useUser } from "../../utils/useUser";
import { ActionButton } from "../../components/ActionButton";
import { GetInitialQueueQuery } from "../../generated/graphql";
import { CancelButton } from "../../components/CancelButton";
import { AcceptDenyButton } from "../../components/AcceptDenyButton";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
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
          <Stack flexShrink={1}>
            <Heading fontWeight="extrabold" size="xl">
              {beep.rider.name}
            </Heading>
            <Text fontSize="xs">
              {beep.rider.rating !== null && beep.rider.rating !== undefined
                ? printStars(beep.rider.rating)
                : null}
            </Text>
          </Stack>
          {beep.isAccepted && (
            <Menu
              key={`menu-${beep.id}`}
              w="190"
              trigger={(triggerProps) => (
                <Pressable
                  accessibilityLabel="More options menu"
                  {...triggerProps}
                >
                  <Icon
                    as={Entypo}
                    color="gray.400"
                    name="dots-three-horizontal"
                    size={19}
                    mr={4}
                  />
                </Pressable>
              )}
            >
              <Menu.Item
                onPress={() => Linking.openURL("tel:" + beep.rider.phone)}
              >
                <HStack alignItems="center">
                  <Text>Call</Text>
                  <Spacer />
                  <Icon as={MaterialCommunityIcons} name="phone" />
                </HStack>
              </Menu.Item>
              <Menu.Item
                onPress={() => Linking.openURL("sms:" + beep.rider.phone)}
              >
                <HStack alignItems="center">
                  <Text>Text</Text>
                  <Spacer />
                  <Icon as={MaterialCommunityIcons} name="message-text" />
                </HStack>
              </Menu.Item>
              {/* <Divider my={1} w="100%" />
              <Menu.Item onPress={() => null}>
                <HStack alignItems="center">
                  <Text color="red.400">Cancel Beep</Text>
                  <Spacer />
                  <Icon
                    as={MaterialCommunityIcons}
                    name="cancel"
                    color="red.400"
                  />
                </HStack>
              </Menu.Item> */}
            </Menu>
          )}
          <Spacer />
          <Avatar size="xl" url={beep.rider.photoUrl} />
        </HStack>
      </Pressable>
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
                    user?.singlesRate,
                    "charge"
                  )
                }
              >
                Request Money from Rider with Venmo
              </Button>
            ) : null}
            {beep.state <= 1 ? (
              <Button
                colorScheme="green"
                onPress={() => openDirections("Current+Location", beep.origin)}
                endIcon={
                  <Icon
                    as={MaterialCommunityIcons}
                    name="map-legend"
                    color="white"
                    size={22}
                  />
                }
              >
                Get Directions to Rider
              </Button>
            ) : (
              <Button
                onPress={() => openDirections(beep.origin, beep.destination)}
                endIcon={
                  <Icon
                    as={MaterialCommunityIcons}
                    name="map-legend"
                    color="white"
                    size={22}
                  />
                }
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
