import React, { useLayoutEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { Text } from "@/components/Text";
import { useQuery } from "@tanstack/react-query";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { useTRPC } from "@/utils/trpc";
import { Avatar } from "@/components/Avatar";
import { Card } from "@/components/Card";
import { getFormattedRatingString, printStars } from "@/components/Stars";
import { Image } from "@/components/Image";

type Props = StaticScreenProps<{ id: string }>;

export function User({ route }: Props) {
  const trpc = useTRPC();
  const navigation = useNavigation();

  const {
    data: user,
    isPending: userPending,
    error: userError,
  } = useQuery(trpc.user.publicUser.queryOptions(route.params.id));

  const { data: userDetails } = useQuery(
    trpc.user.getUserPrivateDetails.queryOptions(route.params.id),
  );

  const { data: car } = useQuery(
    trpc.user.getUsersDefaultCar.queryOptions(route.params.id),
  );

  useLayoutEffect(() => {
    if (user) {
      navigation.setOptions({ title: `${user.first} ${user.last}` });
    }
  }, [user, navigation]);

  if (userPending) {
    return (
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (userError) {
    return (
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Text size="xl" weight="800">
          Error
        </Text>
        <Text>{userError.message}</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 16, paddingTop: 116, gap: 8 }}>
      <View>
        <Text weight="800">Rating</Text>
        <Text>
          {user.rating
            ? `${printStars(Number(user.rating))} (${getFormattedRatingString(user.rating)})`
            : "N/A"}
        </Text>
      </View>
      {userDetails && (
        <>
          <View>
            <Text weight="800">Phone Number</Text>
            <Text>{userDetails.phone}</Text>
          </View>
        </>
      )}
      <View>
        <Text weight="800">Venmo</Text>
        <Text>{user.venmo}</Text>
      </View>
      <View>
        <Text weight="800">Cash App</Text>
        <Text>{user.cashapp}</Text>
      </View>
      {car && (
        <View>
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
        </View>
      )}
    </View>
  );
}
