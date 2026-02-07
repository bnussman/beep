import * as React from "react";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Href, usePathname, useRouter } from "expo-router";
import { capitalize } from "@/utils/strings";
import { useUser } from "../utils/useUser";
import { Avatar } from "./Avatar";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { queryClient, useTRPC } from "@/utils/trpc";
import { LOCATION_TRACKING } from "@/utils/location";
import { Pressable, View, ActivityIndicator } from "react-native";
import { useTheme } from "@/utils/theme";
import { useMutation } from "@tanstack/react-query";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";

interface Route {
  name: string;
  icon: string | React.JSX.Element;
  href: Href;
  isLoading?: boolean;
  onPress?: () => void;
}

const routes: Route[] = [
  {
    name: "Ride",
    icon: "🚗",
    href: '/',
  },
  {
    name: "Beep",
    icon: "🚕",
    href: '/beep',
  },
  {
    name: "Cars",
    icon: "🚙",
    href: '/cars',
  },
 {
    name: "Premium",
    icon: (
      <Text
        size="lg"
        style={{
          shadowRadius: 10,
          shadowColor: "#f5db73",
          shadowOpacity: 1,
        }}
      >
        👑
      </Text>
    ),
    href: '/premium',
  },
  {
    name: "Profile",
    icon: "👤",
    href: '/profile',
  },
  {
    name: "Beeps",
    icon: "🚖",
    href: '/beeps',
  },
  {
    name: "Ratings",
    icon: "⭐️",
    href: '/ratings',
  },
  {
    name: "Feedback",
    icon: "💬",
    href: '/feedback',
  },
];

export function BeepDrawer(props: DrawerContentComponentProps) {
  const trpc = useTRPC();
  const router = useRouter();
  const { user } = useUser();

  const { mutate: logout, isPending } = useMutation(
    trpc.auth.logout.mutationOptions({
      onSuccess() {
        AsyncStorage.clear();

        if (!__DEV__) {
          Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
        }

        queryClient.resetQueries();
      },
      onError(error) {
        alert(error.message);
      },
    }),
  );

  const { mutate: resend, isPending: resendLoading } = useMutation(
    trpc.auth.resendVerification.mutationOptions({
      onSuccess() {
        alert("Successfully resent verification email. Please check your email for further instructions.");
      },
      onError(error) {
        alert(error.message) ;
      },
    }),
  );

  return (
    <DrawerContentScrollView {...props}>
      <View style={{ gap: 12 }}>
        <Pressable
          onPress={() => router.push({ pathname: '/user/[id]', params: { id: user?.id ?? '' } })}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexShrink: 1 }}>
              <Text size="xl" weight="800">
                {user?.first} {user?.last}
              </Text>
              <Text size="xs" color="subtle" weight="300">
                {user?.email}
              </Text>
            </View>
            <Avatar src={user?.photo ?? undefined} />
          </View>
        </Pressable>
        <View style={{ display: "flex", gap: 8 }}>
          {!user?.isEmailVerified && (
            <Button
              onPress={() => resend()}
              isLoading={resendLoading}
            >
              Resend Verification Email
            </Button>
          )}
          {routes.map((route) => (
            <DrawerItem key={route.name} {...route} />
          ))}
          <DrawerItem
            name="Logout"
            onPress={() => logout({ isApp: true })}
            icon="↩️"
            isLoading={isPending}
            href="/sign-up"
          />
        </View>
      </View>
    </DrawerContentScrollView>
  );
}


function DrawerItem(props: Route) {
  const { name, href, isLoading, onPress } = props;

  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();

  const isActive = pathname === href;

  return (
    <Pressable
      onPress={onPress ? onPress : () => router.navigate(href)}
      style={({ pressed }) => [
        {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 16,
          padding: 12,
          borderRadius: 8,
        },
        (isActive || pressed) && {
          backgroundColor: theme.name === "dark" ? "#202020ff" : "#ebebeb91",
        },
      ]}
    >
      {isLoading ?
        <ActivityIndicator size="small" />
        :
        typeof props.icon === 'string' ?
          <Text size="lg">{props.icon}</Text>
          :
          props.icon
      }
      <Text>{capitalize(name)}</Text>
    </Pressable>
  );
}
