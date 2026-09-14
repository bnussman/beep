import { Surface } from "heroui-native";
import { View } from "react-native";
import { Text } from '@/components/Text';
import { Image } from '@/components/Image';
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { getFormattedRatingString, printStars } from "../Stars";

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
      <Surface style={{ gap: 16 }}>
        <View>
          <Text weight="800">Rating</Text>
          <Text>
            {user.rating
              ? `${printStars(Number(user.rating))} (${getFormattedRatingString(user.rating)})`
              : "N/A"}
          </Text>
        </View>
        {userDetails?.phone ? (
          <View>
            <Text weight="800">Phone Number</Text>
            <Text selectable>{userDetails.phone}</Text>
          </View>
        ) : null}
        {user.venmo ? (
          <View>
            <Text weight="800">Venmo</Text>
            <Text selectable>{user.venmo}</Text>
          </View>
        ) : null}
        {user.cashapp ? (
          <View>
            <Text weight="800">Cash App</Text>
            <Text selectable>{user.cashapp}</Text>
          </View>
        ) : null}
      </Surface>

      {car && (
        <Surface>
          <Text weight="800">Car</Text>
          <View style={{ gap: 8 }}>
            <Text>
              {car.year} {car.make} {car.model} {car.color}
            </Text>
            <Image
              src={car.photo}
              style={{ width: 300, height: 200, borderRadius: 12 }}
            />
          </View>
        </Surface>
      )}
    </View>
  );
}