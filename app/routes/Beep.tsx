import { Map } from "@/components/Map";
import { Text } from "@/components/Text";
import { useTheme } from "@/utils/theme";
import { useTRPC } from "@/utils/trpc";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { StaticScreenProps } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, useColorScheme, View } from "react-native";

type Props = StaticScreenProps<{ beepId: string }>;

export function BeepDetails(props: Props) {
  const trpc = useTRPC();
  const theme = useTheme();
  const colorScheme = useColorScheme();

  const {
    data: beep,
    isPending,
    error,
  } = useQuery(trpc.beep.beep.queryOptions(props.route.params.beepId));

  const { data: originCoordinates } = useQuery(
    trpc.location.getCoordinatesFromAddress.queryOptions(beep?.origin ?? "", {
      enabled: !!beep,
    }),
  );

  const { data: destinationCoordinates } = useQuery(
    trpc.location.getCoordinatesFromAddress.queryOptions(
      beep?.destination ?? "",
      {
        enabled: !!beep,
      },
    ),
  );

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
      <Map style={{ height: "100%" }} />
      <BottomSheet
        snapPoints={["20%", "100%"]}
        backgroundStyle={{ backgroundColor: theme.bg.main }}
        handleIndicatorStyle={{ backgroundColor: theme.text.primary }}
      >
        <BottomSheetView style={{ gap: 8, paddingHorizontal: 16 }}>
          <View>
            <Text weight="800">Origin</Text>
            <Text>{beep.origin}</Text>
            {originCoordinates && (
              <Text>
                {originCoordinates.latitude}, {originCoordinates.longitude}
              </Text>
            )}
          </View>
          <View>
            <Text weight="800">Destination</Text>
            <Text>{beep.destination}</Text>
            {destinationCoordinates && (
              <Text>
                {destinationCoordinates.latitude},{" "}
                {destinationCoordinates.longitude}
              </Text>
            )}
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
