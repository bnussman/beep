import React from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Card } from "@/components/Card";
import { Text } from "@/components/Text";
import { Avatar } from "@/components/Avatar";
import { Unpacked } from "../utils/constants";
import { Status } from "../utils/types";
import { ResultOf } from "gql.tada";
import { GetBeepHistory } from "../routes/Beeps";
import { cx } from "class-variance-authority";
import { trpc } from "@/utils/trpc";

interface Props {
  item: Unpacked<ResultOf<typeof GetBeepHistory>["getBeeps"]["items"]>;
  index: number;
}

export const beepStatusMap: Record<Status, string> = {
  [Status.WAITING]: "!bg-green-400",
  [Status.ON_THE_WAY]: "!bg-orange-400",
  [Status.ACCEPTED]: "!bg-green-400",
  [Status.IN_PROGRESS]: "!bg-green-400",
  [Status.HERE]: "!bg-green-400",
  [Status.DENIED]: "!bg-red-400",
  [Status.CANCELED]: "!bg-red-400",
  [Status.COMPLETE]: "!bg-green-400",
};

export function Beep({ item }: Props) {
  const { data: user } = trpc.user.useQuery();
  const navigation = useNavigation();
  const otherUser = user?.id === item.rider.id ? item.beeper : item.rider;
  const isRider = user?.id === item.rider.id;

  return (
    <Card
      className="p-4 gap-1"
      variant="outlined"
      pressable
      onPress={() =>
        navigation.navigate("User", { id: otherUser.id, beepId: item.id })
      }
    >
      <View className="flex flex-row items-center justify-between mb-2">
        <View className="flex flex-row items-center gap-2">
          <Avatar size="xs" src={otherUser.photo ?? undefined} />
          <View className="flex-shrink">
            <Text weight="bold" size="lg">
              {otherUser.name}
            </Text>
            <Text color="subtle">
              {`${isRider ? "Ride" : "Beep"} - ${new Date(
                item.start as string,
              ).toLocaleString()}`}
            </Text>
          </View>
        </View>
        <View>
          <Card className={cx("p-1", beepStatusMap[item.status as Status])}>
            <Text weight="bold" className="capitalize color-white" size="xs">
              {item.status}
            </Text>
          </Card>
        </View>
      </View>
      <Text>
        <Text weight="bold">Group size</Text> <Text>{item.groupSize}</Text>
      </Text>
      <Text>
        <Text weight="bold">Pick Up</Text> <Text>{item.origin}</Text>
      </Text>
      <Text>
        <Text weight="bold">Drop Off</Text> <Text>{item.destination}</Text>
      </Text>
    </Card>
  );
}
