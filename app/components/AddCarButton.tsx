import { Pressable } from "react-native";
import { Text } from "@/components/Text";
import { useRouter } from "expo-router";

export function AddCarButton() {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push("/(app)/cars/create")}
      aria-label="Add a car"
      style={{ paddingRight: 12, transform: [{ translateY: -4 }] }}
    >
      <Text size="4xl">+</Text>
    </Pressable>
  );
}
