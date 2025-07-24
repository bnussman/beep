import React from "react";
import { Text } from "@/components/Text";
import { View } from "react-native";
import { Avatar } from "./Avatar";

interface Props {
  name: string;
  picture: string | null | undefined;
  username: string;
}

export function UserHeader({ picture, name, username }: Props) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <View>
        <Text size="3xl" weight="800">
          {name}
        </Text>
        <Text color="subtle">@{username}</Text>
      </View>
      <Avatar size="lg" src={picture ?? undefined} />
    </View>
  );
}
