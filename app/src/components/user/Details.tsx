import { Surface } from "heroui-native";
import { View } from "react-native";
import { Text } from '@/components/Text';
import { Image } from '@/components/Image';
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { getFormattedRatingString, printStars } from "../Stars";
import { Color, Indicator } from "../Indicator";

interface Props {
  userId: string;
}

export function UserDetails(props: Props) {
  const { data: user } = useQuery(
    orpc.user.publicUser.queryOptions({ input: props.userId })
  );

  const { data: userDetails } = useQuery(
    orpc.user.getUserPrivateDetails.queryOptions({ input: props.userId }),
  );

  const { data: car } = useQuery(
    orpc.user.getUsersDefaultCar.queryOptions({ input: props.userId })
  );

  if (!user) {
    return null;
  }

  return (
    <View style={{ gap: 8 }}>
      <Surface style={{ gap: 12 }}>
        <View className="flex flex-row justify-between">
          <Text weight="800">Rating</Text>
          {user.rating ? (
            <Text>
              <Text color="subtle">({getFormattedRatingString(user.rating)})</Text>{" "}
              <Text>{printStars(Number(user.rating))}</Text>
            </Text>
          ) : (
            <Text>N/A</Text>
          )}
        </View>
        <View className="flex flex-row justify-between">
          <Text weight="800">Beeping</Text>
          <View className="flex flex-row gap-2 items-center">
            <Text>
              {user.isBeeping && (
                <Text color="subtle">
                  ({user.queueSize} riders)
                </Text>
              )}
            </Text>
            <Indicator color={user.isBeeping ? "green" : "red"} />
          </View>
        </View>
        <View className="flex flex-row justify-between">
          <Text weight="800">Rates</Text>
          <Text selectable>${user.singlesRate} singles / ${user.groupRate} groups</Text>
        </View>
        {userDetails?.phone ? (
          <View className="flex flex-row justify-between">
            <Text weight="800">Phone Number</Text>
            <Text selectable>{userDetails.phone}</Text>
          </View>
        ) : null}
        {user.venmo ? (
          <View className="flex flex-row justify-between">
            <Text weight="800">Venmo</Text>
            <Text selectable>{user.venmo}</Text>
          </View>
        ) : null}
        {user.cashapp ? (
          <View className="flex flex-row justify-between">
            <Text weight="800">Cash App</Text>
            <Text selectable>{user.cashapp}</Text>
          </View>
        ) : null}
      </Surface>
      {car && (
        <Surface className="gap-4">
          <View className="flex flex-row justify-between">
            <Text weight="800">Car</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <Text>
                  {car.year} {car.make} {car.model}
                </Text>
                <Indicator color={car.color as Color} />
              </View>
            </View>
            <Image
              src={car.photo}
              style={{ width: 300, height: 200, borderRadius: 12 }}
            />
        </Surface>
      )}
    </View>
  );
}