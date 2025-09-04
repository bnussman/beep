import React from "react";
import { useUser } from "../../utils/useUser";
import * as DropdownMenu from "zeego/dropdown-menu";
import { ActionButton } from "../../components/ActionButton";
import { AcceptDenyButton } from "../../components/AcceptDenyButton";
import { Alert, Linking, View } from "react-native";
import { Button } from "@/components/Button";
import { Avatar } from "@/components/Avatar";
import { Text } from "@/components/Text";
import { Map } from "@/components/Map";
import { printStars } from "../../components/Stars";
import {
  getRawPhoneNumber,
  openCashApp,
  openDirections,
  openVenmo,
} from "../../utils/links";
import { useTRPC, type RouterOutput } from "@/utils/trpc";
import { Card } from "@/components/Card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { decodePolyline, getMiles } from "@/utils/location";
import { Marker } from "@/components/Marker";
import { Polyline } from "@/components/Polyline";
import { isMobile } from "@/utils/constants";

interface Props {
  beep: RouterOutput["beeper"]["queue"][number];
}

export function Beep(props: Props) {
  const { beep } = props;
  const { user } = useUser();
  const trpc = useTRPC();

  const { data: beepRoute } = useQuery(
    trpc.location.getRoute.queryOptions({
      origin: beep.origin,
      destination: beep.destination,
    }),
  );

  const route = beepRoute?.routes[0];

  const polylineCoordinates = route?.legs
    .flatMap((leg) => leg.steps)
    .map((step) => decodePolyline(step.geometry))
    .flat();

  const origin = beepRoute && {
    latitude: beepRoute.waypoints[0].location[1],
    longitude: beepRoute.waypoints[0].location[0],
  };

  const destination = beepRoute && {
    latitude: beepRoute.waypoints[1].location[1],
    longitude: beepRoute.waypoints[1].location[0],
  };

  const middlePointInRoute = polylineCoordinates && {
    ...polylineCoordinates[Math.floor(polylineCoordinates.length / 2)],
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const queryClient = useQueryClient();
  const { mutate: cancel, isPending } = useMutation(
    trpc.beeper.updateBeep.mutationOptions({
      onSuccess(data) {
        queryClient.setQueryData(trpc.beeper.queue.queryKey(), data);
      },
      onError(error) {
        alert(error.message);
      },
    }),
  );

  const onPress = () => {
    if (isMobile) {
      Alert.alert(
        "Cancel Beep?",
        "Are you sure you want to cancel this beep?",
        [
          {
            text: "No",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: onCancel,
          },
        ],
        { cancelable: true },
      );
    } else {
      onCancel();
    }
  };

  const onCancel = () => {
    cancel({ beepId: beep.id, data: { status: "canceled" } });
  };

  return (
    <View style={{ gap: 8, height: "100%", paddingBottom: 76 }}>
      <Card variant="filled" style={{ padding: 16, gap: 16 }}>
        <View
          style={{
            flexDirection: "row",
            gap: 16,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text color="subtle">Your current rider is</Text>
            <Text weight="800" size="2xl">
              {beep.rider.first} {beep.rider.last}
            </Text>
            <Text size="xs" color="subtle">
              {beep.rider.rating
                ? printStars(Number(beep.rider.rating))
                : "No Rating"}
            </Text>
          </View>
          <Avatar size="md" src={beep.rider.photo ?? undefined} />
        </View>
      </Card>
      {polylineCoordinates && middlePointInRoute && origin && destination && (
        <Card style={{ flexGrow: 1, gap: 8 }}>
          <Text size="xl" weight="800">
            Beep Details
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text weight="bold" style={{ width: 120 }}>
              Current Status
            </Text>
            <Text
              style={{
                textTransform: "capitalize",
                flexShrink: 1,
                textAlign: "right",
              }}
            >
              {beep.status === "waiting"
                ? "Waiting for you to accept or deny"
                : beep.status.replaceAll("_", " ")}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text weight="bold" style={{ width: 120 }}>
              Group Size
            </Text>
            <Text>{beep.groupSize}</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text weight="bold" style={{ width: 120 }}>
              Joined Queue At
            </Text>
            <Text>
              {new Date(beep.start).toLocaleTimeString(undefined, {
                timeStyle: "short",
              })}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text weight="bold" style={{ width: 120 }}>
              Pick Up
            </Text>
            <Text style={{ flexShrink: 1, textAlign: "right" }} selectable>
              {beep.origin}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text weight="bold" style={{ width: 120 }}>
              Drop Off
            </Text>
            <Text style={{ flexShrink: 1, textAlign: "right" }} selectable>
              {beep.destination}
            </Text>
          </View>
          {route && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text weight="bold" style={{ width: 120 }}>
                Beep Distance
              </Text>
              <Text style={{ flexShrink: 1, textAlign: "right" }}>
                {getMiles(route.distance, true)} miles (about a{" "}
                {Math.round(route.duration / 60)} min drive)
              </Text>
            </View>
          )}
          <Map
            key={beep.id}
            style={{ borderRadius: 8, flexGrow: 1 }}
            initialRegion={middlePointInRoute}
            onStartShouldSetResponder={(event) => true}
            showsUserLocation
          >
            <Marker coordinate={origin} />
            <Marker coordinate={destination} />
            <Polyline
              coordinates={polylineCoordinates ?? []}
              strokeWidth={5}
              strokeColor="#3d8ae3"
              lineCap="round"
            />
          </Map>
        </Card>
      )}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button>More Options</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item
            key="Call"
            onSelect={() =>
              Linking.openURL("tel:" + getRawPhoneNumber(beep.rider.phone))
            }
          >
            <DropdownMenu.ItemTitle>Call</DropdownMenu.ItemTitle>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            key="Text"
            onSelect={() =>
              Linking.openURL("sms:" + getRawPhoneNumber(beep.rider.phone))
            }
          >
            <DropdownMenu.ItemTitle>Text</DropdownMenu.ItemTitle>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            key="directions-to-rider"
            onSelect={() => openDirections("Current+Location", beep.origin)}
          >
            <DropdownMenu.ItemTitle>Directions to Rider</DropdownMenu.ItemTitle>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            key="directions-for-beep"
            onSelect={() => openDirections(beep.origin, beep.destination)}
          >
            <DropdownMenu.ItemTitle>Directions for Beep</DropdownMenu.ItemTitle>
          </DropdownMenu.Item>
          {(beep.status === "here" || beep.status === "in_progress") && (
            <>
              {beep.rider.venmo && (
                <DropdownMenu.Item
                  key="request-money-with-venmo"
                  onSelect={() =>
                    openVenmo(
                      beep.rider.venmo,
                      beep.groupSize,
                      user?.groupRate,
                      user?.singlesRate,
                      "charge",
                    )
                  }
                >
                  <DropdownMenu.ItemTitle>
                    Request Money with Venmo
                  </DropdownMenu.ItemTitle>
                </DropdownMenu.Item>
              )}
              {beep.rider.cashapp && (
                <DropdownMenu.Item
                  key="request-money-with-cash-app"
                  onSelect={() =>
                    openCashApp(
                      beep.rider.cashapp,
                      beep.groupSize,
                      user?.groupRate,
                      user?.singlesRate,
                    )
                  }
                >
                  <DropdownMenu.ItemTitle>
                    Request Money with Cash App
                  </DropdownMenu.ItemTitle>
                </DropdownMenu.Item>
              )}
            </>
          )}
          {beep.status !== "waiting" && (
            <DropdownMenu.Item key="cancel" onSelect={onPress} destructive>
              <DropdownMenu.ItemTitle>Cancel Beep</DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      {beep.status === "waiting" ? (
        <View style={{ flexDirection: "row", gap: 8 }}>
          <AcceptDenyButton item={beep} type="deny" />
          <AcceptDenyButton style={{ flexGrow: 1 }} item={beep} type="accept" />
        </View>
      ) : (
        <ActionButton beep={beep} />
      )}
    </View>
  );
}
