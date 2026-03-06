import React from "react";
import { useUser } from "@/utils/useUser";
import { Pressable, SafeAreaView, View } from "react-native";
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
  description: string;
}

export default function EditProfileScreen() {
  const trpc = useTRPC();
  const { user } = useUser();

  const links: LinkItem[] = [
    {
      icon: '🙎🏽‍♂',
      title: 'Profile',
      href: "/profile/edit",
      description: "Configure your profile.",
    },
    {
      icon: '🚕',
      title: 'Beeps',
      href: "/profile/beeps",
      description: "View beeps you've participated in.",
    },
    {
      icon: '⭐️',
      title: 'Ratings',
      href: "/profile/ratings",
      description: "View your driver and rider ratings.",
    },
    {
      icon: '🚙',
      title: 'Cars',
      href: "/profile/cars",
      description: "View your cars used for beeping.",
    },
    {
      icon: '👑',
      title: 'Premium',
      href: "/profile/premium",
      description: "Manage your premium subscription.",
    },
    {
      icon: '💬',
      title: 'Feedback',
      href: '/profile/feedback',
      description: "Send us your feedback and suggestions.",
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
      <View style={{ paddingHorizontal: 16, gap: user?.isEmailVerified ? 32 : 24 }}>
        <Link href={{ pathname: "/user/[id]", params: { id: user?.id ?? '' } }} asChild>
          <Link.Trigger>
            <Pressable style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12, justifyContent: 'space-between' }}>
              <View>
                <Text size="2xl" weight="bold">{user?.first} {user?.last}</Text>
                <Text color="subtle">{user?.email}</Text>
              </View>
              <Avatar src={user?.photo ?? undefined} size="md" />
            </Pressable>
          </Link.Trigger>
          <Link.Preview />
        </Link>
        {!user?.isEmailVerified && (
          <Card style={{ gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text size="2xl">📧</Text>
              <Text weight="bold">Your email is not verified</Text>
            </View>
            <View>
              <Text>You must verify your email to access all features.</Text>
              <Text>Check your email (<Text color="subtle" style={{ fontStyle: 'italic' }}>{user?.email}</Text>) for a verification link.</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
              <Text>Didn't receive the email?</Text>
              <Button
                onPress={() => resend()}
                isLoading={resendLoading}
                size="sm"
              >
                Resend it!
              </Button>
            </View>
          </Card>
        )}
        {links.map((link) => (
          <Link href={link.href} asChild key={link.title}>
            <Link.Trigger>
              <Pressable>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                  <Text size="2xl">{link.icon}</Text>
                  <View>
                    <Text>{link.title}</Text>
                    <Text color="subtle" size="xs">{link.description}</Text>
                  </View>
                  <View style={{ flex: 1 }} />
                  <Text>→</Text>
                </View>
              </Pressable>
            </Link.Trigger>
            <Link.Preview />
          </Link>
        ))}
      </View>
    </SafeAreaView>
  );
}
