import React, { useEffect, useRef } from "react";
import MapView from "react-native-maps";
import { useUser } from "../../utils/useUser";
import { ActionButton } from "../../components/ActionButton";
import { AcceptDenyButton } from "../../components/AcceptDenyButton";
import { Alert, View } from "react-native";
import { Button } from "@/components/Button";
import { Avatar } from "@/components/Avatar";
import { Text } from "@/components/Text";
import { Map } from "@/components/Map";
import { printStars } from "../../components/Stars";
import { useTRPC, type RouterOutput } from "@/utils/trpc";
import { Card } from "@/components/Card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { decodePolyline, getMiles } from "@/utils/location";
import { Marker } from "@/components/Marker";
import { Polyline } from "@/components/Polyline";
import { isMobile } from "@/utils/constants";
import { Menu } from "@/components/Menu";
import {
  call,
  openCashApp,
  openDirections,
  openMaps,
  openVenmo,
  sms,
} from "../../utils/links";
import { Elipsis } from "@/components/Elipsis";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";

interface Props {
  beep: RouterOutput["beeper"]["queue"][number];
}

export function Beep(props: Props) {
  const { beep } = props;
  const { user } = useUser();
  const router = useRouter();
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

  const queryClient = useQueryClient();

  const { mutate: cancel } = useMutation(
    trpc.beeper.updateBeep.mutationOptions({
      onSuccess(data) {
        queryClient.setQueryData(trpc.beeper.queue.queryKey(), data);
      },
      onError(error) {
        alert(error.message);
      },
    }),
  );

  const ref = useRef<MapView>(null);

  useEffect(() => {
    if (ref.current && origin && destination) {
      ref.current.fitToCoordinates([origin, destination], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, [origin, destination]);

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
            style: "destructive",
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
      <Card
        variant="filled"
        style={{ padding: 16, gap: 16 }}
        pressable
        onPress={() => router.push({ pathname: '/user/[id]', params: { id: beep.rider.id } })}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 16,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexShrink: 1 }}>
            <Text color="subtle">Your current rider is</Text>
            <Text weight="800" size="2xl">
              {beep.rider.first} {beep.rider.last}
            </Text>
          </View>
          <Avatar size="md" src={beep.rider.photo ?? undefined} />
        </View>
      </Card>
      <View
        style={{
          flexDirection: "row",
          gap: 8,
        }}
      >
        <Card style={{ flex: 1, justifyContent: "center" }}>
          <Text weight="bold">Group Size</Text>
          <Text>{beep.groupSize}</Text>
        </Card>
        <Card style={{ flex: 1, justifyContent: "center" }}>
          <Text weight="bold">Started at</Text>
          <Text>
            {new Date(beep.start).toLocaleTimeString(undefined, {
              timeStyle: "short",
            })}
          </Text>
        </Card>
        {route && (
          <Card style={{ flexShrink: 1, justifyContent: "center" }}>
            <Text weight="bold" style={{ flexShrink: 1 }}>
              Beep Distance
            </Text>
            <Text style={{ flexShrink: 1 }}>
              {Math.round(route.duration / 60)} min
            </Text>
          </Card>
        )}
      </View>
      <Card
        pressable
        onPress={() => openMaps(beep.origin)}
        onLongPress={() => null}
      >
        <Text weight="bold">Pick Up</Text>
        <Text style={{ flexShrink: 1 }} selectable>
          {beep.origin}
        </Text>
      </Card>
      <Card
        pressable
        onPress={() => openMaps(beep.destination)}
        onLongPress={() => null}
      >
        <Text weight="bold">Drop Off</Text>
        <Text style={{ flexShrink: 1 }} selectable>
          {beep.destination}
        </Text>
      </Card>
      <View style={{ flexGrow: 1 }}>
        {polylineCoordinates && origin && destination && (
          <Map
            key={beep.id}
            ref={ref}
            style={{ borderRadius: 16, flexGrow: 1, overflow: "hidden" }}
            onStartShouldSetResponder={(event) => true}
            showsUserLocation
          >
            <Marker
              coordinate={origin}
              title="Pick Up"
              description={beep.origin}
              identifier="origin"
            />
            <Marker
              coordinate={destination}
              title="Drop Off"
              description={beep.destination}
              identifier="destination"
            />
            <Polyline
              coordinates={polylineCoordinates ?? []}
              strokeWidth={5}
              strokeColor="#3d8ae3"
              lineCap="round"
            />
          </Map>
        )}
      </View>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Menu
          trigger={
            <Button
              style={{ paddingHorizontal: 16, paddingVertical: 6 }}
              size="md"
            >
              <Elipsis />
            </Button>
          }
          options={[
            {
              title: "Call",
              show: beep.status !== "waiting",
              onClick: () => call(beep.rider.id),
            },
            {
              title: "Text",
              show: beep.status !== "waiting",
              onClick: () => sms(beep.rider.id),
            },
            {
              title: "Directions to Rider",
              onClick: () => openDirections("Current+Location", beep.origin),
            },
            {
              title: "Directions for Beep",
              onClick: () => openDirections(beep.origin, beep.destination),
            },
            {
              title: "Request Money with Venmo",
              show:
                (beep.status === "here" || beep.status === "in_progress") &&
                Boolean(beep.rider.venmo),
              onClick: () =>
                openVenmo(
                  beep.rider.venmo,
                  beep.groupSize,
                  user?.groupRate,
                  user?.singlesRate,
                  "charge",
                ),
            },
            {
              title: "Request Money with Cash App",
              show:
                (beep.status === "here" || beep.status === "in_progress") &&
                Boolean(beep.rider.cashapp),
              onClick: () =>
                openCashApp(
                  beep.rider.cashapp,
                  beep.groupSize,
                  user?.groupRate,
                  user?.singlesRate,
                ),
            },
            {
              title: "Cancel Beep",
              onClick: onPress,
              destructive: true,
              show: beep.status !== "waiting" && beep.status !== "in_progress",
            },
          ]}
        />
        {beep.status === "waiting" ? (
          <View style={{ flexDirection: "row", gap: 8, flexGrow: 1 }}>
            <AcceptDenyButton item={beep} type="deny" />
            <AcceptDenyButton
              style={{ flexGrow: 1 }}
              item={beep}
              type="accept"
            />
          </View>
        ) : (
          <ActionButton beep={beep} />
        )}
      </View>
    </View>
  );
}
