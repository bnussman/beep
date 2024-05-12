import React from "react";
import { Unpacked } from "../../utils/constants";
import { useUser } from "../../utils/useUser";
import { ActionButton } from "../../components/ActionButton";
import { CancelButton } from "../../components/CancelButton";
import { AcceptDenyButton } from "../../components/AcceptDenyButton";
import { Linking, Pressable, View } from "react-native";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Avatar } from "@/components/Avatar";
import { Text } from "@/components/Text";
import { useNavigation } from "@react-navigation/native";
import { printStars } from "../../components/Stars";
import { Status } from "../../utils/types";
import { ResultOf } from "gql.tada";
import { GetInitialQueue } from "./StartBeeping";
import {
  getRawPhoneNumber,
  openCashApp,
  openDirections,
  openVenmo,
} from "../../utils/links";

interface Props {
  beep: Unpacked<ResultOf<typeof GetInitialQueue>["getQueue"]>;
}

export function Beep(props: Props) {
  const { beep } = props;
  const { user } = useUser();
  const { navigate } = useNavigation();

  return (
    <View className="gap-4 h-full pb-8">
      <Pressable onPress={() => navigate("User", { id: beep.rider.id, beepId: beep.id })}>
        <Card variant="outlined" className="p-4">
          <View>
            <Text className="flex-shrink" weight="bold">
              {beep.rider.name}
            </Text>
            {beep.rider.rating && (
              <Text size="sm">{printStars(beep.rider.rating)}</Text>
            )}
          </View>
          <Avatar src={beep.rider.photo ?? undefined} />
        </Card>
      </Pressable>
      <Card variant="outlined" className="p-4">
        <Text weight="bold">Group Size</Text>
        <Text>{beep.groupSize}</Text>
        <Text weight="bold">Pick Up</Text>
        <Text>{beep.origin}</Text>
        <Text weight="bold">Destination</Text>
        <Text>{beep.destination}</Text>
      </Card>
      <View className="flex-grow" />
      {beep.status === Status.WAITING ? (
        <View className="flex flex-row gap-4">
          <AcceptDenyButton item={beep} type="deny" />
          <AcceptDenyButton item={beep} type="accept" />
        </View>
      ) : (
        <>
          <Button
            onPress={() => {
              Linking.openURL("tel:" + getRawPhoneNumber(beep.rider.phone));
            }}
          >
            Call
          </Button>
          <Button
            onPress={() => {
              Linking.openURL("sms:" + getRawPhoneNumber(beep.rider.phone));
            }}
          >
            Text
          </Button>
          {[Status.HERE, Status.IN_PROGRESS].includes(
            beep.status as Status,
          ) && (
            <>
              {beep.rider.cashapp && (
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
              )}
              {beep.rider?.venmo && (
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
              )}
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
    </View>
  );
}
