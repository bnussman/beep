import { Avatar } from "@/components/Avatar";
import { BottomSheet } from "@/components/BottomSheet";
import { Map } from "@/components/Map";
import { Marker } from "@/components/Marker";
import { Polyline } from "@/components/Polyline";
import { Text } from "@/components/Text";
import { decodePolyline, getMiles } from "@/utils/location";
import { useTRPC } from "@/utils/trpc";
import { useUser } from "@/utils/useUser";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import { skipToken, useQuery } from "@tanstack/react-query";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import MapView from "react-native-maps";

export default function BeepDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const trpc = useTRPC();
  const mapRef = useRef<MapView>(null);
  const navigation = useNavigation();

  const { user } = useUser();

  const {
    data: beep,
    isPending,
    error,
  } = useQuery(trpc.beep.beep.queryOptions(id));

  const { data: route } = useQuery(
    trpc.location.getRoute.queryOptions(
      beep
        ? {
            origin: beep.origin,
            destination: beep.destination,
          }
        : skipToken,
    ),
  );

  const polylineCoordinates = route?.routes[0].legs
    .flatMap((leg) => leg.steps)
    .map((step) => decodePolyline(step.geometry))
    .flat();

  const origin = route && {
    latitude: route.waypoints[0].location[1],
    longitude: route.waypoints[0].location[0],
  };

  const destination = route && {
    latitude: route.waypoints[1].location[1],
    longitude: route.waypoints[1].location[0],
  };

  useEffect(() => {
    const locations = [origin, destination].filter((l) => l !== undefined);
    mapRef.current?.fitToCoordinates(locations, {
      animated: true,
      edgePadding: { bottom: 100, left: 50, right: 50, top: 50 },
    });
  }, [origin, destination]);

  const otherUser = beep?.rider_id === user?.id ? beep?.beeper : beep?.rider;

  if (error) {
    return (
      <View
        style={{
          padding: 16,
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Text>Error</Text>
        <Text>{error.message}</Text>
      </View>
    );
  }

  if (isPending) {
    return (
      <View
        style={{
          padding: 16,
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ gap: 8, height: "100%" }}>
      <Map ref={mapRef} style={{ height: "100%" }}>
        {origin && <Marker coordinate={origin} identifier="origin" />}
        {destination && (
          <Marker coordinate={destination} identifier="destination" />
        )}
        {polylineCoordinates && (
          <Polyline
            coordinates={polylineCoordinates ?? []}
            strokeWidth={5}
            strokeColor="#3d8ae3"
            lineCap="round"
          />
        )}
      </Map>
      <BottomSheet snapPoints={["20%"]} enableDynamicSizing>
        <BottomSheetView
          style={{ gap: 8, paddingHorizontal: 16, paddingBottom: 32 }}
        >
          <Link href={`/(app)/user/${otherUser?.id}`}>
            <Text weight="800">
              {beep?.rider_id === user?.id ? "Beeper" : "Rider"}
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Text>
                {otherUser?.first} {otherUser?.last}
              </Text>
              <Avatar
                src={otherUser?.photo ?? undefined}
                style={{ width: 16, height: 16 }}
              />
            </View>
          </Link>
          <View>
            <Text weight="800">Origin</Text>
            <Text>{beep.origin}</Text>
          </View>
          <View>
            <Text weight="800">Destination</Text>
            <Text>{beep.destination}</Text>
          </View>
          {route && (
            <View>
              <Text weight="800">Distance</Text>
              <Text>
                {getMiles(route.routes[0].distance, true)} miles (~
                {Math.round(route.routes[0].duration / 60)} min)
              </Text>
            </View>
          )}
          <View>
            <Text weight="800">Group Size</Text>
            <Text>{beep.groupSize}</Text>
          </View>
          <View>
            <Text weight="800">Status</Text>
            <Text style={{ textTransform: "capitalize" }}>
              {beep.status.replaceAll("_", " ")}
            </Text>
          </View>
          <View>
            <Text weight="800">Started</Text>
            <Text>{new Date(beep.start).toLocaleString()}</Text>
          </View>
          {beep.end && (
            <View>
              <Text weight="800">Ended</Text>
              <Text>{new Date(beep.end).toLocaleString()}</Text>
            </View>
          )}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
