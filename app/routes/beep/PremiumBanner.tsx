import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Countdown } from "@/components/CountDown";
import { Text } from "@/components/Text";
import { trpc } from "@/utils/trpc";
import { useNavigation } from "@react-navigation/native";

export function PremiumBanner() {
  const navigation = useNavigation();

  const { data: payments } = trpc.payment.activePayments.useQuery();

  const payment = payments?.[0];

  return (
    <Card variant="outlined" className="p-4 items-center">
    {payment ? (
      <>
        <Text weight="black" size="xl">
          You are premium! 👑
        </Text>
        <Text className="text-center mb-4 mt-2">
          Expires in <Countdown date={new Date(payment.expires)} />
        </Text>
      </>
    ) : (
      <>
        <Text weight="black" size="xl">
          Want more riders?
        </Text>
        <Text className="text-center mb-4">
          Jump to the top of the beeper list
        </Text>
        <Button
          className="flex flex-row gap-2 dark:!bg-neutral-700 active:dark:!bg-neutral-800"
          onPress={() => navigation.navigate("Main", { screen: "Premium" })}
        >
          <Text weight="bold">Get Promoted</Text>
          <Text>👑</Text>
        </Button>
      </>
    )}
    </Card>
  );
}
