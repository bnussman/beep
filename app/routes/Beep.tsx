import { Avatar } from "@/components/Avatar";
import { Map } from "@/components/Map";
import { Marker } from "@/components/Marker";
import { Polyline } from "@/components/Polyline";
import { Text } from "@/components/Text";
import { decodePolyline } from "@/utils/location";
import { useTheme } from "@/utils/theme";
import { useTRPC } from "@/utils/trpc";
import { useUser } from "@/utils/useUser";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { StaticScreenProps } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, View } from "react-native";

type Props = StaticScreenProps<{ beepId: string }>;

export function BeepDetails(props: Props) {
  const trpc = useTRPC();
  const theme = useTheme();
  const { user } = useUser();

  const {
    data: beep,
    isPending,
    error,
  } = useQuery(trpc.beep.beep.queryOptions(props.route.params.beepId));

  const { data: route } = useQuery(
    trpc.location.getRoute.queryOptions(
      {
        origin: beep?.origin ?? "",
        destination: beep?.destination ?? "",
      },
      {
        enabled: !!beep,
      },
    ),
  );

  const polylineCoordinates = route?.routes[0].legs
    .flatMap((leg) => leg.steps)
    .map((step) => decodePolyline(step.geometry as unknown as string))
    .flat();

  const origin = route && {
    latitude: route.waypoints[0].location[1],
    longitude: route.waypoints[0].location[0],
  };

  const destination = route && {
    latitude: route.waypoints[1].location[1],
    longitude: route.waypoints[1].location[0],
  };

  const middlePointInRoute = polylineCoordinates && {
    ...polylineCoordinates[Math.floor(polylineCoordinates.length / 2)],
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

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
      {polylineCoordinates && middlePointInRoute && origin && destination && (
        <Map style={{ height: "100%" }} initialRegion={middlePointInRoute}>
          <Marker coordinate={origin} />
          <Marker coordinate={destination} />
          <Polyline
            coordinates={polylineCoordinates ?? []}
            strokeWidth={5}
            strokeColor="#3d8ae3"
            lineCap="round"
          />
        </Map>
      )}
      <BottomSheet
        snapPoints={["20%", "100%"]}
        backgroundStyle={{ backgroundColor: theme.bg.main }}
        handleIndicatorStyle={{ backgroundColor: theme.text.primary }}
      >
        <BottomSheetView style={{ gap: 8, paddingHorizontal: 16 }}>
          <View>
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
          </View>
          <View>
            <Text weight="800">Origin</Text>
            <Text>{beep.origin}</Text>
          </View>
          <View>
            <Text weight="800">Destination</Text>
            <Text>{beep.destination}</Text>
          </View>
          <View>
            <Text weight="800">Group Size</Text>
            <Text>{beep.groupSize}</Text>
          </View>
          <View>
            <Text weight="800">Status</Text>
            <Text style={{ textTransform: "capitalize" }}>
              {beep.status.replace("_", " ")}
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
