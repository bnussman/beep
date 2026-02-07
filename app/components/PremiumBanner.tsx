import React from 'react';
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Countdown } from "@/components/CountDown";
import { Text } from "@/components/Text";
import { useNavigation } from "@react-navigation/native";
import { useActivePayments } from '@/app/(app)/(drawer)/premium';
import { useRouter } from 'expo-router';

export function PremiumBanner() {
  const router = useRouter();

  const { data: payments } = useActivePayments();

  const payment = payments?.[0];

  return (
    <Card style={{ padding: 16, alignItems: 'center', gap: 8 }}>
      {payment ? (
        <>
          <Text weight="800" size="xl">
            You are premium! 👑
          </Text>
          <Text>
            Expires in <Countdown date={new Date(payment.expires)} />
          </Text>
        </>
      ) : (
        <>
          <Text weight="800" size="xl">
            Want more riders?
          </Text>
          <Text>
            Jump to the top of the beeper list
          </Text>
          <Button onPress={() => router.push('/premium')}>
            Get Promoted 👑
          </Button>
        </>
      )}
    </Card>
  );
}
