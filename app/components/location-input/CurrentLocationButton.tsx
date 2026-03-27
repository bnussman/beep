import { ActivityIndicator, Pressable } from "react-native";
import { Text } from '../Text';

export interface Props {
  isLoading: boolean;
  onPress: () => void;
}

export function CurrentLocationButton(props: Props) {
  if (props.isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <Pressable onPress={props.onPress} style={{ paddingTop: 4 }} hitSlop={24}>
      <Text size="2xl">️📍</Text>
    </Pressable>
  );
}