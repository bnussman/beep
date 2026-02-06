import { useNavigation } from "@react-navigation/native";
import { Pressable } from "react-native";
import { Text } from "@/components/Text";

export function AddCarButton() {
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() => navigation.navigate("Add Car")}
      aria-label="Add a car"
      style={{ paddingRight: 12, transform: [{ translateY: -4 }] }}
    >
      <Text size="4xl">+</Text>
    </Pressable>
  );
}
