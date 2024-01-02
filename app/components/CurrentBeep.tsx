import React from "react";
import { Unpacked } from "../utils/constants";
import {
  getRawPhoneNumber,
  openCashApp,
  openDirections,
  openVenmo,
} from "../utils/links";
import { useUser } from "../utils/useUser";
import { ActionButton } from "./ActionButton";
import { GetInitialQueueQuery } from "../generated/graphql";
import { CancelButton } from "./CancelButton";
import { AcceptDenyButton } from "./AcceptDenyButton";
import { Linking } from "react-native";
import { Navigation } from "../utils/Navigation";
import { Avatar } from "./Avatar";
import { useNavigation } from "@react-navigation/native";
import { Card } from "./Card";
import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  IconButton,
  Pressable,
  Spacer,
  Stack,
  Text,
  useClipboard,
  useToast,
} from "native-base";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { printStars } from "./Stars";
import { Status } from "../utils/types";
import { Logger } from "../utils/Logger";

interface Props {
  beep: Unpacked<GetInitialQueueQuery["getQueue"]>;
}

export function Beep(props: Props) {
  const { beep } = props;
  const { user } = useUser();
  const { navigate } = useNavigation<Navigation>();
  const { onCopy } = useClipboard();
  const { show } = useToast();

  const copy = (value: string) => {
    show({ description: "Copied to Clipboard 📋" });
    onCopy(value);
  };

  return (
    <>
      <Pressable
        onPress={() =>
          navigate("Profile", {
            id: beep.rider.id,
            beepId: beep.id,
          })
        }
      >
        <HStack alignItems="center" space={4}>
          <Stack>
            <Heading
              flexShrink={1}
              fontWeight="extrabold"
              letterSpacing="sm"
              size="xl"
            >
              {beep.rider.name}
            </Heading>
            {beep.rider.rating !== null && beep.rider.rating !== undefined ? (
              <Text fontSize="xs">{printStars(beep.rider.rating)}</Text>
            ) : null}
          </Stack>
          <Spacer />
          <Avatar size="xl" url={beep.rider.photo} />
        </HStack>
      </Pressable>
      <Card mt={4}>
        <Stack space={2}>
          <Box>
            <Heading size="sm" fontWeight="extrabold" letterSpacing="sm">
              Group Size
            </Heading>
            <Text>{beep.groupSize}</Text>
          </Box>
          <Pressable onPress={() => copy(beep.origin)}>
            <Box>
              <Heading size="sm" fontWeight="extrabold" letterSpacing="sm">
                Pick Up
              </Heading>
              <HStack alignItems="center" space={2}>
                <Text flexShrink={1}>{beep.origin}</Text>
                <Spacer />
                <Icon
                  as={MaterialCommunityIcons}
                  name="content-copy"
                  size="sm"
                />
              </HStack>
            </Box>
          </Pressable>
          <Pressable onPress={() => copy(beep.destination)}>
            <Box>
              <Heading size="sm" fontWeight="extrabold" letterSpacing="sm">
                Destination
              </Heading>
              <HStack alignItems="center" space={2}>
                <Text flexShrink={1}>{beep.destination}</Text>
                <Spacer />
                <Icon
                  as={MaterialCommunityIcons}
                  name="content-copy"
                  size="sm"
                />
              </HStack>
            </Box>
          </Pressable>
        </Stack>
      </Card>
      <Spacer />
      <Stack space={3}>
        {beep.status === Status.WAITING ? (
          <>
            <AcceptDenyButton item={beep} type="deny" />
            <AcceptDenyButton item={beep} type="accept" />
          </>
        ) : (
          <>
            <HStack space={2}>
              <IconButton
                flexGrow={1}
                variant="solid"
                onPress={() => {
                  Linking.openURL("tel:" + getRawPhoneNumber(beep.rider.phone));
                }}
                icon={
                  <Icon as={Ionicons} color="white" name="ios-call" size="md" />
                }
              />
              <IconButton
                flexGrow={1}
                variant="solid"
                onPress={() => {
                  Linking.openURL("sms:" + getRawPhoneNumber(beep.rider.phone));
                }}
                icon={
                  <Icon
                    as={Ionicons}
                    name="ios-chatbox"
                    color="white"
                    size="md"
                  />
                }
              />
            </HStack>
            {[Status.HERE, Status.IN_PROGRESS].includes(
              beep.status as Status
            ) && (
              <>
                {beep.rider.cashapp ? (
                  <Button
                    colorScheme="green"
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
                    colorScheme="lightBlue"
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
            {[Status.ON_THE_WAY, Status.ACCEPTED].includes(
              beep.status as Status
            ) ? (
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
            {[Status.ON_THE_WAY, Status.WAITING, Status.ACCEPTED].includes(
              beep.status as Status
            ) && <CancelButton beep={beep} />}
            <ActionButton beep={beep} />
          </>
        )}
      </Stack>
    </>
  );
}