import { Card } from "@/components/Card";
import { Text } from "@/components/Text";
import { trpc } from "@/utils/trpc";
import { useLocation } from "@/utils/location";
import { ActivityIndicator } from 'react-native';

interface Location {
  latitude: number;
  longitude: number;
}

interface Props {
  beeperLocation: Location | null;
}

export function ETA(props: Props) {
  const { beeperLocation } = props;
  const { location } = useLocation();

  const { data, error, isLoading } = trpc.location.getETA.useQuery(
    {
      start: `${beeperLocation?.longitude},${beeperLocation?.latitude}`,
      end: `${location?.coords.longitude},${location?.coords.latitude}`,
    },
    {
      enabled: Boolean(beeperLocation) && Boolean(location)
    },
  );

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator />;
    }

    if (error) {
      return <Text>{error.message}</Text>;
    }

    if (data) {
      return <Text>{data}</Text>;
    }

    return null;
  };

  return (
    <Card
      variant="outlined"
      style={{ padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
    >
      <Text size="xl" weight="800">
        ETA
      </Text>
      {renderContent()}
    </Card>
  );
}
