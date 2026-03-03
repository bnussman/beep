import React from "react";
import { useUser } from "@/utils/useUser";
import { View } from "react-native";
import { Avatar } from "@/components/Avatar";
import { Text } from "@/components/Text";

export default function EditProfileScreen() {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <View>
      <Avatar src={user.photo ?? undefined} />
      <Text>{user.first}</Text>
    </View>
  );
}
