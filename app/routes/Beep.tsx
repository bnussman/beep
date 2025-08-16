import { Map } from "@/components/Map";
import { Text } from "@/components/Text";
import { decodePolyline } from "@/utils/location";
import { useTheme } from "@/utils/theme";
import { useTRPC } from "@/utils/trpc";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { StaticScreenProps } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, View } from "react-native";
import { Marker, Polyline } from "react-native-maps";

type Props = StaticScreenProps<{ beepId: string }>;

export function BeepDetails(props: Props) {
  const trpc = useTRPC();
  const theme = useTheme();

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

  // console.log(JSON.stringify(route, null, 2));

  const r = route?.routes?.[0].legs
    ?.flatMap((leg) => leg.steps)
    .map((step) => decodePolyline(step?.geometry as unknown as string))
    .flat();

  const middlePointInRoute = r && {
    ...r[Math.floor(r.length / 2)],
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  console.log(JSON.stringify(r, null, 2));

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
      {r && middlePointInRoute && (
        <Map style={{ height: "100%" }} initialRegion={middlePointInRoute}>
          <Polyline
            coordinates={r ?? []}
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
