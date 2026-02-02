import { Text } from "@/components/Text";
import { useLocation } from "@/utils/location";
import { ActivityIndicator, View } from "react-native";
import { skipToken, useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";

interface Location {
  latitude: number;
  longitude: number;
}

interface Props {
  beeperLocation: Location | null | undefined;
}

export function ETA(props: Props) {
  const { beeperLocation } = props;
  const { location } = useLocation();

  const { data, error, isPending } = useQuery(
    orpc.location.getETA.queryOptions({
      input: beeperLocation && location
        ? {
            start: `${beeperLocation.longitude},${beeperLocation.latitude}`,
            end: `${location.coords.longitude},${location.coords.latitude}`,
          }
        : skipToken,
    }),
  );

  const renderContent = () => {
    if (isPending) {
      return <ActivityIndicator />;
    }

    if (error) {
      return <Text>{error.message}</Text>;
    }

    return <Text>{data}</Text>;
  };

  return (
    <View>
      <Text weight="800">ETA</Text>
      {renderContent()}
    </View>
  );
}
