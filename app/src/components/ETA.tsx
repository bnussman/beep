import { Text } from "@/components/Text";
import { View } from "react-native";

interface Props {
  eta: string | null;
}

export function ETA(props: Props) {

  const renderBody = () => {
    if (props.eta) {
      return `Pick up ${getRelativeTimeInMinutes(props.eta)} (at ${new Date(props.eta).toLocaleTimeString([], { timeStyle: 'short' })})`;
    }

    return "N/A";
  };

  return (
    <View>
      <Text weight="800">ETA</Text>
      <Text>{renderBody()}</Text>
    </View>
  );
}

function getRelativeTimeInMinutes(isoString: string) {
  const targetDate = new Date(isoString);
  const now = new Date();

  // Calculate the difference in milliseconds
  const diffInMs = targetDate.getTime() - now.getTime();

  // Convert milliseconds to total minutes
  const diffInMinutes = Math.round(diffInMs / 1000 / 60);

  // Return future or past string format
  if (diffInMinutes >= 0) {
    return `in ${diffInMinutes} min`;
  } else {
    return `${Math.abs(diffInMinutes)} min ago`;
  }
}
