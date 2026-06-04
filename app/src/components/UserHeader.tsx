import React from "react";
import { Text } from "@/components/Text";
import { View } from "react-native";
import { Avatar } from "./Avatar";

interface Props {
  name: string;
  picture: string | null | undefined;
}

export function UserHeader({ picture, name }: Props) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Text size="3xl" weight="800">
        {name}
      </Text>
      <Avatar size="lg" src={picture ?? undefined} />
    </View>
  );
}
