import { useNavigation } from "@react-navigation/native";
import { Pressable } from "react-native";
import { Text } from "@/components/Text";

export function AddCarButton() {
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() => navigation.navigate("Add Car")}
      aria-label="Add a car"
      style={{ paddingRight: 12 }}
    >
      <Text size="3xl">➕</Text>
    </Pressable>
  );
}
