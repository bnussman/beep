import React from "react";
import { Unpacked } from "../../utils/constants";
import { useUser } from "../../utils/useUser";
import { ActionButton } from "../../components/ActionButton";
import { CancelButton } from "../../components/CancelButton";
import { AcceptDenyButton } from "../../components/AcceptDenyButton";
import { Linking, Pressable } from "react-native";
import { Avatar } from "../../components/Avatar";
import { useNavigation } from "@react-navigation/native";
import { printStars } from "../../components/Stars";
import { Status } from "../../utils/types";
import { ResultOf } from "gql.tada";
import { GetInitialQueue } from "./StartBeeping";
import { MessageCircle, PhoneCall } from "@tamagui/lucide-icons";
import {
  getRawPhoneNumber,
  openCashApp,
  openDirections,
  openVenmo,
} from "../../utils/links";
import {
  Card,
  Stack,
  Button,
  Heading,
  XStack,
  Spacer,
  Text,
} from "@beep/ui";

interface Props {
  beep: Unpacked<ResultOf<typeof GetInitialQueue>['getQueue']>;
}

export function Beep(props: Props) {
  const { beep } = props;
  const { user } = useUser();
  const { navigate } = useNavigation();

  return (
    <>
      <Pressable onPress={() => navigate("User", { id: beep.rider.id, beepId: beep.id, })}>
        <Card flexDirection="row" alignItems="center" p="$3" gap="$4">
          <Stack>
            <Heading flexShrink={1} fontWeight="bold">
              {beep.rider.name}
            </Heading>
            {beep.rider.rating && (
              <Text fontSize="$1">{printStars(beep.rider.rating)}</Text>
            )}
          </Stack>
          <Spacer />
          <Avatar size="$4" url={beep.rider.photo} />
        </Card>
      </Pressable>
      <Card mt="$4" p="$3">
        <Stack gap="$2">
          <Stack>
            <Heading fontWeight="bold">
              Group Size
            </Heading>
            <Text>{beep.groupSize}</Text>
          </Stack>
          <Stack>
            <Heading fontWeight="bold">
              Pick Up
            </Heading>
            <Text flexShrink={1}>{beep.origin}</Text>
          </Stack>
          <Stack>
            <Heading fontWeight="bold">
              Destination
            </Heading>
            <Text flexShrink={1}>{beep.destination}</Text>
          </Stack>
        </Stack>
      </Card>
      <Stack flexGrow={1} />
      <Stack gap="$3">
        {beep.status === Status.WAITING ? (
          <>
            <AcceptDenyButton item={beep} type="deny" />
            <AcceptDenyButton item={beep} type="accept" />
          </>
        ) : (
          <>
            <XStack gap="$2">
              <Button
                flexGrow={1}
                onPress={() => {
                  Linking.openURL("tel:" + getRawPhoneNumber(beep.rider.phone));
                }}
                icon={<PhoneCall />}
              />
              <Button
                flexGrow={1}
                onPress={() => {
                  Linking.openURL("sms:" + getRawPhoneNumber(beep.rider.phone));
                }}
                icon={<MessageCircle />}
              />
            </XStack>
            {[Status.HERE, Status.IN_PROGRESS].includes(
              beep.status as Status
            ) && (
              <>
                {beep.rider.cashapp && (
                  <Button
                    theme="green"
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
                )}
                {beep.rider?.venmo && (
                  <Button
                    theme="blue"
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
                )}
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
