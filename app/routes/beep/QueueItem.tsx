import React, { useEffect, useRef } from "react";
import MapView from "react-native-maps";
import { Alert, View } from "react-native";
import { isMobile } from "@/utils/constants";
import { call, openDirections, sms } from "@/utils/links";
import { printStars } from "@/components/Stars";
import { Avatar } from "@/components/Avatar";
import { Card } from "@/components/Card";
import { Text } from "@/components/Text";
import { RouterOutput, useTRPC } from "@/utils/trpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { decodePolyline, getMiles } from "@/utils/location";
import { Map } from "@/components/Map";
import { Marker } from "@/components/Marker";
import { Polyline } from "@/components/Polyline";
import { Menu } from "@/components/Menu";

interface Props {
  item: RouterOutput["beeper"]["queue"][number];
  index: number;
}

export function QueueItem({ item: beep }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    trpc.beeper.updateBeep.mutationOptions({
      onSuccess(data) {
        queryClient.setQueryData(trpc.beeper.queue.queryKey(), data);
      },
      onError(error) {
        alert(error.message);
      },
    }),
  );

  const mapRef = useRef<MapView>(null);

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

  useEffect(() => {
    if (mapRef.current && origin && destination) {
      mapRef.current.fitToCoordinates([origin, destination], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, [origin, destination]);

  const onPromptCancel = () => {
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
            style: "destructive",
          },
        ],
        { cancelable: true },
      );
    } else {
      onCancel();
    }
  };

  const onCancel = () => {
    mutate({ beepId: beep.id, data: { status: "canceled" } });
  };

  return (
    <Menu
      activationMethod="longPress"
      trigger={
        <Card variant="filled" style={{ padding: 16, gap: 16 }} pressable>
          <View
            style={{
              flexDirection: "row",
              gap: 16,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text weight="800" size="2xl">
                {beep.rider.first} {beep.rider.last}
              </Text>
              <Text size="xs" color="subtle">
                {beep.rider.rating
                  ? printStars(Number(beep.rider.rating))
                  : "No Rating"}
              </Text>
            </View>
            <Avatar size="xs" src={beep.rider.photo ?? undefined} />
          </View>
          <View style={{ gap: 4 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text weight="bold" style={{ width: 90 }}>
                Status
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
                  : beep.status}
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
                Pick Up
              </Text>
              <Text style={{ flexShrink: 1, textAlign: "right" }}>
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
              <Text style={{ flexShrink: 1, textAlign: "right" }}>
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
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
          </View>
          {polylineCoordinates && origin && destination && (
            <Map
              ref={mapRef}
              style={{ height: 200, borderRadius: 10, overflow: "hidden" }}
              onStartShouldSetResponder={(event) => true}
            >
              <Marker coordinate={origin} identifier="origin" />
              <Marker coordinate={destination} identifier="destination" />
              <Polyline
                coordinates={polylineCoordinates ?? []}
                strokeWidth={5}
                strokeColor="#3d8ae3"
                lineCap="round"
              />
            </Map>
          )}
        </Card>
      }
      options={
        beep.status === "waiting"
          ? [
              {
                title: "Accept",
                onClick: () =>
                  mutate({ beepId: beep.id, data: { status: "accepted" } }),
              },
              {
                title: "Deny",
                destructive: true,
                onClick: () =>
                  mutate({ beepId: beep.id, data: { status: "denied" } }),
              },
            ]
          : [
              {
                title: "Call",
                onClick: () => call(beep.rider.id),
              },
              {
                title: "Text",
                onClick: () => sms(beep.rider.id),
              },
              {
                title: "Directions to Rider",
                onClick: () => openDirections("Current+Location", beep.origin),
              },
              {
                title: "Cancel Beep",
                onClick: onPromptCancel,
                destructive: true,
              },
            ]
      }
    />
  );
}
