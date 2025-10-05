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
  openVenmo,
  sms,
} from "../../utils/links";

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
    if (ref.current) {
      ref.current.fitToSuppliedMarkers(["origin", "destination"], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, [beepRoute]);

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
      <Card variant="filled" style={{ padding: 16, gap: 16 }}>
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
            <Text size="xs" color="subtle">
              {beep.rider.rating
                ? printStars(Number(beep.rider.rating))
                : "No Rating"}
            </Text>
          </View>
          <Avatar size="md" src={beep.rider.photo ?? undefined} />
        </View>
      </Card>

      <Card style={{ flexGrow: 1, gap: 8 }}>
        <Text size="xl" weight="800">
          Beep Details
        </Text>
        <View style={{ gap: 4 }}>
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
                ? "Waiting for accept or deny"
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
        </View>
        {polylineCoordinates && origin && destination && (
          <Map
            key={beep.id}
            ref={ref}
            style={{ borderRadius: 8, flexGrow: 1 }}
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
      </Card>
      <Menu
        trigger={<Button>Options</Button>}
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
