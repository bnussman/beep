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
      href: "/profile/beeps",
    },
    {
      icon: '⭐️',
      title: 'Ratings',
      href: "/profile/ratings",
    },
    {
      icon: '🚙',
      title: 'Cars',
      href: "/profile/cars",
    },
    {
      icon: '👑',
      title: 'Premium',
      href: "/profile/premium",
    },
    {
      icon: '💬',
      title: 'Feedback',
      href: '/profile/feedback',
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
        <Link href="/profile/edit" asChild>
          <Link.Trigger>
            <Card pressable style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Avatar src={user?.photo ?? undefined} size="xs" />
              <Text size="xl" weight="bold">{user?.first} {user?.last}</Text>
            </Card>
          </Link.Trigger>
          <Link.Preview />
        </Link>
        {!user?.isEmailVerified && (
          <Card style={{ gap: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text size="2xl">📧</Text>
              <Text weight="bold">Your email is not verified </Text>
            </View>
            <View>
              <Text>You must verify your email to access all features.</Text>
              <Text>Check your email <Text color="subtle" style={{ fontStyle: 'italic' }}>{user?.email}</Text> for a verification link.</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
              <Text>Didn't receive the email?</Text>
              <Button
                onPress={() => resend()}
                isLoading={resendLoading}
              >
                Resend it!
              </Button>
            </View>
          </Card>
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
