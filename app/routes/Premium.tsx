import React from "react";
import { useEffect, useState } from "react";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { Image } from "@/components/Image";
import { Button } from "@/components/Button";
import { View, ActivityIndicator } from "react-native";
import type {
  PurchasesOffering,
  PurchasesPackage,
} from "react-native-purchases";
import PremiumImage from "../assets/premium.png";
import { Logger } from "../utils/logger";
import { Countdown } from "../components/CountDown";
import { FlatList, RefreshControl } from "react-native";
import { trpc } from "@/utils/trpc";

interface Props {
  item: PurchasesOffering;
  disabled: boolean;
}

function Offering({ item, disabled }: Props) {
  const packages = item.availablePackages;

  return (
    <Card className="p-4 gap-2" variant="outlined">
      <Text weight="black" size="2xl">
        {item.identifier}
      </Text>
      <Text>
        Promotes you to the top of the beeper list so you get more riders
        joining your queue
      </Text>
      <Text size="sm">Goes into effect immediately upon purchase</Text>
      <Image
        source={PremiumImage}
        className="h-64 w-full"
        resizeMode="contain"
        alt="beep screenshot of premium"
      />
      {packages.map((p) => (
        <Package key={p.identifier} p={p} disabled={disabled} />
      ))}
    </Card>
  );
}

function Package({ p, disabled }: { p: PurchasesPackage, disabled: boolean }) {
  const [isPurchasing, setIsPurchasing] = useState(false);

  const { mutateAsync: checkVerificationStatus } = trpc.user.syncMyPayments.useMutation();

  const { data, refetch } = trpc.payment.activePayments.useQuery();

  const payment = data?.find(
    (sub) => sub.productId === p.product.identifier,
  );

  const countdown = payment?.expires ? <Countdown date={new Date(payment.expires)} /> : null;

  const onBuy = async (item: PurchasesPackage) => {
    if (Boolean(payment)) {
      return alert("You are already promoted on the beeper list.");
    }

    setIsPurchasing(true);

    try {
      const Purchases: typeof import("react-native-purchases").default =
        require("react-native-purchases").default;
      await Purchases.purchasePackage(item);
      await checkVerificationStatus();
    } catch (e: any) {
      if (!e.userCancelled) {
        Logger.error(e);
        alert(`Error purchasing package ${e.message}`);
      }
    } finally {
      // always refetch. The webhook to the server may beat `checkVerificationStatus`, and it might throw.
      refetch();
      setIsPurchasing(false);
    }
  };

  return (
    <Card
      className="py-2 px-4 flex flex-row items-center gap-2"
      variant="outlined"
    >
      <Text weight="bold">{p.identifier}</Text>
      <Text size="sm">{countdown}</Text>
      <View className="flex-grow" />
      {Boolean(payment) && <Text>✅</Text>}
      <Button
        isLoading={isPurchasing}
        onPress={() => onBuy(p)}
        disabled={disabled}
        className="dark:bg-stone-800 dark:active:!bg-stone-700"
      >
        {p.product.priceString}
      </Button>
    </Card>
  );
}

function usePackages() {
  const [offerings, setOfferings] = useState<PurchasesOffering[]>();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);

  const isRefreshing = Boolean(offerings) && isLoading;

  const getOfferings = async () => {
    if (!isLoading) {
      setIsLoading(true);
    }
    try {
      const Purchases: typeof import("react-native-purchases").default =
        require("react-native-purchases").default;
      const offerings = await Purchases.getOfferings();
      if (
        offerings.current !== null &&
        offerings.current.availablePackages.length !== 0
      ) {
        const topOfBeeperListPackages: PurchasesOffering[] = Object.values(
          offerings.all,
        );
        setOfferings(topOfBeeperListPackages);
      }
    } catch (e) {
      Logger.error(e);
      setError("Unable to load offerings.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getOfferings();
  }, []);

  return {
    offerings,
    error,
    isLoading: isLoading && offerings === undefined,
    refetch: getOfferings,
    isRefreshing
  };
}

export function Premium() {
  const {
    data: activePayments,
    error: activePaymentsError,
    isLoading: isLoadingActivePayments,
    refetch: refetchActivePayments,
    isRefetching: isRefetchingActivePayments,
  } = trpc.payment.activePayments.useQuery();

  const {
    offerings,
    error: packagesError,
    isLoading: isLoadingPackages,
    refetch: refetchAppPackages,
    isRefreshing: isRefetchingAppPackages,
  } = usePackages();

  const refetch = () => {
    refetchActivePayments();
    refetchAppPackages();
  };

  if (isLoadingActivePayments || isLoadingPackages) {
    return (
      <View className="flex items-center justify-center h-full">
        <ActivityIndicator />
      </View>
    );
  }

  if (packagesError) {
    return (
      <View className="flex items-center justify-center h-full">
        <Text>{packagesError}</Text>
      </View>
    );
  }

  if (activePaymentsError) {
    return (
      <View className="flex items-center justify-center h-full">
        <Text>{activePaymentsError.message}</Text>
      </View>
    );
  }

  const numberOfActivePayments = activePayments?.length ?? 0;

  return (
    <FlatList
      data={offerings}
      contentContainerClassName="p-4"
      renderItem={({ item }) => <Offering item={item} disabled={numberOfActivePayments > 0} />}
      onRefresh={refetch}
      refreshing={isRefetchingAppPackages || isRefetchingActivePayments}
    />
  );
}
