import React from "react";
import { useUser } from "@/utils/useUser";
import { SafeAreaView, View } from "react-native";
import { Avatar } from "@/components/Avatar";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { Link, LinkProps } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";
import { Button } from "@/components/Button";

interface LinkItem {
  icon: string | React.JSX.Element;
  href: LinkProps['href'],
  title: string;
}

export default function EditProfileScreen() {
  const trpc = useTRPC();
  const { user } = useUser();

  const links: LinkItem[] = [
    {
      icon: '🚕',
      title: 'Beeps',
      href: '/(app)/(tabs)/profile/beeps',
    },
    {
      icon: '⭐️',
      title: 'Ratings',
      href: '/(app)/(tabs)/profile/ratings',
    },
    {
      icon: '🚙',
      title: 'Cars',
      href: '/(app)/(tabs)/profile/cars',
    },
    {
      icon: '👑',
      title: 'Premium',
      href: '/(app)/(tabs)/profile/premium',
    },
    {
      icon: '💬',
      title: 'Feedback',
      href: '/(app)/(tabs)/profile/feedback',
    },
  ]

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
    <SafeAreaView>
      <View style={{ paddingHorizontal: 16, gap: 8 }}>
        <Link href="/(app)/(tabs)/profile/edit" asChild>
          <Link.Trigger>
            <Card pressable style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Avatar src={user?.photo ?? undefined} size="sm" />
              <Text size="xl" weight="bold">{user?.first} {user?.last}</Text>
            </Card>
          </Link.Trigger>
          <Link.Preview />
        </Link>
        {!user?.isEmailVerified && (
          <Button
            onPress={() => resend()}
            isLoading={resendLoading}
          >
            Resend Verification Email
          </Button>
        )}
        {links.map((link) => (
          <Link href={link.href} asChild key={link.title}>
            <Link.Trigger>
              <Card pressable style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Text size="2xl">{link.icon}</Text>
                <Text>{link.title}</Text>
              </Card>
            </Link.Trigger>
            <Link.Preview />
          </Link>
        ))}
      </View>
    </SafeAreaView>
  );
}
