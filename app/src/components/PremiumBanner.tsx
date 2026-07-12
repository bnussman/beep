import React from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Countdown } from "@/components/CountDown";
import { Text } from "@/components/Text";
import { useRouter } from "expo-router";
import { useActivePayments } from "@/app/(tabs)/(beep,ride,profile)/premium";
import { View } from "react-native";

export function PremiumBanner() {
  const router = useRouter();

  const { data: payments } = useActivePayments();

  const payment = payments?.[0];

  return (
    <View style={{ padding: 16, alignItems: "center", gap: 8 }}>
      {payment ? (
        <>
          <Text weight="800" size="xl">
            You are premium! 👑
          </Text>
          <Text>
            Expires in <Countdown date={payment.expires} />
          </Text>
        </>
      ) : (
        <>
          <Text weight="800" size="xl">
            Want more riders?
          </Text>
          <Text style={{ textAlign: "center", marginBottom: 8 }}>
            Get premium to show at the top of the beeper list
          </Text>
          <Button onPress={() => router.navigate("/premium")}>
            Get Premium 👑
          </Button>
        </>
      )}
    </View>
  );
}
