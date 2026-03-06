import React from "react";
import { ActivityIndicator, SafeAreaView, View } from "react-native";
import { Text } from "@/components/Text";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import { useTRPC } from "@/utils/trpc";
import { getFormattedRatingString, printStars } from "@/components/Stars";
import { Image } from "@/components/Image";
import { useLocalSearchParams } from "expo-router";
import { Avatar } from "@/components/Avatar";
// import { SafeAreaView } from 'react-native-screens/experimental';

export default function User() {
  const trpc = useTRPC();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    data: user,
    isPending: userPending,
    error: userError,
  } = useQuery(trpc.user.publicUser.queryOptions(id));

  const { data: userDetails } = useQuery(
    trpc.user.getUserPrivateDetails.queryOptions(id),
  );

  const { data: car } = useQuery(
    trpc.user.getUsersDefaultCar.queryOptions(id),
  );

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
        <ActivityIndicator />
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
    <SafeAreaView>
      <View style={{ padding: 16, gap: 8 }}>
        <Text size="3xl" weight="bold" style={{ letterSpacing: 0.2 }}>
          {user.first} {user.last}
        </Text>
        <Avatar src={user.photo ?? undefined} size="xl" style={{ position: 'absolute', right: 16 }} />
        <View style={{ gap: 24 }}>
          <View>
            <Text weight="800">Rating</Text>
            <Text>
              {user.rating
                ? `${printStars(Number(user.rating))} (${getFormattedRatingString(user.rating)})`
                : "N/A"}
            </Text>
          </View>
          {userDetails && (
            <View>
              <Text weight="800">Phone Number</Text>
              <Text selectable>{userDetails.phone}</Text>
            </View>
          )}
          {user.venmo && (
            <View>
              <Text weight="800">Venmo</Text>
              <Text selectable>{user.venmo}</Text>
            </View>
          )}
          {user.cashapp && (
            <View>
              <Text weight="800">Cash App</Text>
              <Text selectable>{user.cashapp}</Text>
            </View>
          )}
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
      </View>
    </SafeAreaView>
  );
}