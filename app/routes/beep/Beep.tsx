import React from "react";
import { Unpacked } from "../../utils/constants";
import {
  getRawPhoneNumber,
  openCashApp,
  openDirections,
  openVenmo,
} from "../../utils/links";
import { useUser } from "../../utils/useUser";
import { ActionButton } from "../../components/ActionButton";
import { GetInitialQueueQuery } from "../../generated/graphql";
import { CancelButton } from "../../components/CancelButton";
import { AcceptDenyButton } from "../../components/AcceptDenyButton";
import { Linking, Pressable } from "react-native";
import { Navigation } from "../../utils/Navigation";
import { Avatar } from "../../components/Avatar";
import { useNavigation } from "@react-navigation/native";
import { Card } from "../../components/Card";
import { Stack, Button, XStack, SizableText, Paragraph, H5, H3 } from "tamagui";
import { printStars } from "../../components/Stars";
import { Status } from "../../utils/types";
import { Phone, MessageSquare } from "@tamagui/lucide-icons";

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
            beepId: beep.id,
          })
        }
      >
        <XStack alignItems="center" space={4}>
          <Stack>
            <H3 flexShrink={1} fontWeight="bold">
              {beep.rider.name}
            </H3>
            {beep.rider.rating !== null && beep.rider.rating !== undefined ? (
              <SizableText fontSize="$1">
                {printStars(beep.rider.rating)}
              </SizableText>
            ) : null}
          </Stack>
          <Stack flexGrow={1} />
          <Avatar size="xl" url={beep.rider.photo} />
        </XStack>
      </Pressable>
      <Card mt={4}>
        <Stack space={2}>
          <Stack>
            <H5 fontWeight="bold">Group Size</H5>
            <SizableText>{beep.groupSize}</SizableText>
          </Stack>
          <H5 fontWeight="bold">Pick Up</H5>
          <Paragraph flexShrink={1}>{beep.origin}</Paragraph>
          <H5 fontWeight="bold">Destination</H5>
          <Paragraph flexShrink={1}>{beep.destination}</Paragraph>
        </Stack>
      </Card>
      <Stack flexGrow={1} />
      <Stack space={3}>
        {beep.status === Status.WAITING ? (
          <>
            <AcceptDenyButton item={beep} type="deny" />
            <AcceptDenyButton item={beep} type="accept" />
          </>
        ) : (
          <>
            <XStack space={2}>
              <Button
                flexGrow={1}
                onPress={() => {
                  Linking.openURL("tel:" + getRawPhoneNumber(beep.rider.phone));
                }}
                iconAfter={<Phone />}
              />
              <Button
                flexGrow={1}
                onPress={() => {
                  Linking.openURL("sms:" + getRawPhoneNumber(beep.rider.phone));
                }}
                iconAfter={<MessageSquare />}
              />
            </XStack>
            {[Status.HERE, Status.IN_PROGRESS].includes(
              beep.status as Status,
            ) && (
              <>
                {beep.rider.cashapp ? (
                  <Button
                    onPress={() =>
                      openCashApp(
                        beep.rider.cashapp,
                        beep.groupSize,
                        user?.groupRate,
                        user?.singlesRate,
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
                        "charge",
                      )
                    }
                  >
                    Request Money from Rider with Venmo
                  </Button>
                ) : null}
              </>
            )}
            {[Status.ON_THE_WAY, Status.ACCEPTED].includes(
              beep.status as Status,
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
              beep.status as Status,
            ) && <CancelButton beep={beep} />}
            <ActionButton beep={beep} />
          </>
        )}
      </Stack>
    </>
  );
}
