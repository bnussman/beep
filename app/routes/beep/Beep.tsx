import React from "react";
import { useUser } from "../../utils/useUser";
import { ActionButton } from "../../components/ActionButton";
import { CancelButton } from "../../components/CancelButton";
import { AcceptDenyButton } from "../../components/AcceptDenyButton";
import { Linking, View } from "react-native";
import { Button } from "@/components/Button";
import { Avatar } from "@/components/Avatar";
import { Text } from "@/components/Text";
import { printStars } from "../../components/Stars";
import {
  getRawPhoneNumber,
  openCashApp,
  openDirections,
  openVenmo,
} from "../../utils/links";
import type { RouterOutput } from "@/utils/trpc";

interface Props {
  beep: RouterOutput['beeper']['queue'][number];
}

export function Beep(props: Props) {
  const { beep } = props;
  const { user } = useUser();

  return (
    <View style={{ flex: 1, paddingBottom: 32, gap: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexShrink: 1 }}>
          <Text weight="800" size="3xl">
            {beep.rider.first} {beep.rider.last}
          </Text>
          {beep.rider.rating && (
            <Text size="sm">{printStars(Number(beep.rider.rating))}</Text>
          )}
        </View>
        <Avatar src={beep.rider.photo ?? undefined} size="xl" />
      </View>
      <Text size="xl" weight="800">Group Size</Text>
      <Text selectable>{beep.groupSize}</Text>
      <Text size="xl" weight="800">Pick Up</Text>
      <Text selectable>{beep.origin}</Text>
      <Text size="xl" weight="800">Destination</Text>
      <Text selectable>{beep.destination}</Text>
      <View style={{ flexGrow: 1 }} />
      {beep.status === "waiting" ? (
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <AcceptDenyButton item={beep} type="deny" />
          <AcceptDenyButton item={beep} type="accept" />
        </View>
      ) : (
        <>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Button
                style={{ flexGrow: 1 }}
                onPress={() => {
                  Linking.openURL("tel:" + getRawPhoneNumber(beep.rider.phone));
                }}
              >
                Call 📞
              </Button>
              <Button
                style={{ flexGrow: 1 }}
                onPress={() => {
                  Linking.openURL("sms:" + getRawPhoneNumber(beep.rider.phone));
                }}
              >
                Text 💬
              </Button>
            </View>
          {(beep.status === "here" || beep.status === "in_progress") && (
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
          {(beep.status === "on_the_way" || beep.status === "accepted") ? (
            <Button
              onPress={() => openDirections("Current+Location", beep.origin)}
            >
              Get Directions to Rider 🗺️
            </Button>
          ) : (
            <Button
              onPress={() => openDirections(beep.origin, beep.destination)}
            >
              Get Directions for Beep 🗺️
            </Button>
          )}
          {(beep.status === "on_the_way" || beep.status === "accepted") && (
            <CancelButton beep={beep} />
          )}
          <ActionButton beep={beep} />
        </>
      )}
    </View>
  );
}
