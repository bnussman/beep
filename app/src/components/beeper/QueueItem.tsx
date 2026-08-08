import MapView from "react-native-maps";
import { useEffect, useRef } from "react";
import { Alert, Pressable, View } from "react-native";
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
import { Link } from "expo-router";
import { Separator } from "heroui-native";
import { Indicator } from "../Indicator";

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
      trigger={({ onLongPress }) => (
        <Card style={{ padding: 16, gap: 16 }} onLongPress={onLongPress}>
          <Link
            href={{
              pathname: "/user/[id]",
              params: { id: beep.rider.id, beepId: beep.id },
            }}
            asChild
          >
            <Link.Trigger>
              <View
                style={{
                  flexDirection: "row",
                  gap: 16,
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ flexShrink: 1 }}>
                  <Text weight="800" size="xl">
                    {beep.rider.first} {beep.rider.last}
                  </Text>
                  <Text color="subtle" style={{ fontSize: 10 }}>
                    {beep.rider.rating && printStars(Number(beep.rider.rating))}
                  </Text>
                  <Text size="xs">
                    <Text color="subtle">
                      Joined your queue at{" "}
                    </Text>
                    <Text color="subtle" weight="bold">
                      {new Date(beep.start).toLocaleTimeString(undefined, {
                        timeStyle: "short",
                      })}
                    </Text>
                  </Text>
                  {beep.status === 'waiting' && (
                    <Text color="subtle" size="xs">
                      Please accept or deny this rider.
                    </Text>
                  )}
                </View>
                <Avatar size="md" src={beep.rider.photo ?? undefined} />
              </View>
            </Link.Trigger>
          </Link>
          <Separator />
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 16,
              alignItems: 'center',
            }}
          >
            <View style={{ flexGrow: 1 }}>
              <Text weight="bold" >
                Status
              </Text>
              <View style={{ display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                <Text style={{ textTransform: "capitalize",  }}>
                  {beep.status.replaceAll('_', ' ')}
                </Text>
                {beep.status === 'waiting' && <Indicator color="yellow" size={12} />}
                {beep.status === 'accepted' && <Indicator color="green" size={12} />}
              </View>
            </View>
            <Separator orientation="vertical" />
            <View style={{ flexGrow: 1 }}>
              <Text weight="bold">Group Size</Text>
              <Text>{beep.groupSize}</Text>
            </View>
            {route && (route.duration / 60 < 60) && (
              <>
                <Separator orientation="vertical" />
                <View>
                  <Text weight="bold">
                    Distance
                  </Text>
                  <Text >
                    {getMiles(route.distance, true)} mi
                    ({Math.round(route.duration / 60)} min)
                  </Text>
                </View>
              </>
            )}
          </View>
          <Separator />
          <View>
            <Text weight="bold">Pick Up</Text>
            <Text>{beep.origin}</Text>
          </View>
          <View>
            <Text weight="bold">Drop Off</Text>
            <Text>{beep.destination}</Text>
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
      )}
      options={
        [
          ...(beep.status === 'waiting' ? [
            {
              title: "Accept",
              sfIcon: "checkmark" as const,
              onClick: () =>
              mutate({ beepId: beep.id, data: { status: "accepted" } }),
            },
            {
              title: "Deny",
              sfIcon: "xmark" as const,
              destructive: true,
              onClick: () =>
              mutate({ beepId: beep.id, data: { status: "denied" } }),
            }
          ] : []),
          ...(beep.status === 'accepted' ? [
            {
              title: "Contact",
              sfIcon: "phone.fill" as const,
              options: [

                {
                  title: "Call",
                  sfIcon: "phone.fill" as const,
                  onClick: () => call(beep.rider.id),
                },
                {
                  title: "Text",
                  sfIcon: "message.fill" as const,
                  onClick: () => sms(beep.rider.id),
                },
              ],
            }] : []),
          {
            title: "Directions",
            sfIcon: "map.fill",
            options: [
              {
                title: "Directions to Rider",
                sfIcon: "figure.wave",
                onClick: () =>
                openDirections("Current+Location", beep.origin),
              },
              {
                title: "Directions for Beep",
                sfIcon: "map.fill",
                onClick: () => openDirections(beep.origin, beep.destination),
              },
            ],
          },
          ...(beep.status === 'accepted' ? [
            {
              title: "Cancel Beep",
              sfIcon: "xmark" as const,
              onClick: onPromptCancel,
              destructive: true,
            },
          ] : []),
        ]
      }
    />
  );
}
