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
// @ts-expect-error idk
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
    <Card style={{ padding: 16, gap: 8 }} variant="outlined">
      <Text weight="800" size="2xl">
        {item.identifier} ✨
      </Text>
      <Text>
        Promotes you to the top of the beeper list so you get more riders
        joining your queue
      </Text>
      <Text size="xs" style={{ marginBottom: 4 }}>
        Goes into effect immediately upon purchase and cannot be paused.
        When riders go to find a beeper, beepers are ordered by their premium status,
        then by their distance.
      </Text>
      <Image
        source={PremiumImage}
        style={{ width: '100%', height: 256 }}
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

  const { data, refetch } = useActivePayments();

  const payment = data?.find(
    (sub) => sub.productId === p.product.identifier,
  );

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
      style={{ paddingHorizontal: 8, paddingVertical: 8, gap: 8, flexDirection: 'row', alignItems: 'center' }}
      variant="outlined"
    >
      <Text weight="bold">{p.identifier}</Text>
      {payment && (
        <Text size="sm">
          Expires in <Countdown date={new Date(payment.expires)} />
        </Text>
      )}
      <View style={{ flexGrow: 1 }} />
      {Boolean(payment) && <Text>✅</Text>}
      <Button
        isLoading={isPurchasing}
        onPress={() => onBuy(p)}
        disabled={disabled}
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
  } = useActivePayments();

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
      <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (packagesError) {
    return (
      <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Text>{packagesError}</Text>
      </View>
    );
  }

  if (activePaymentsError) {
    return (
      <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Text>{activePaymentsError.message}</Text>
      </View>
    );
  }

  const numberOfActivePayments = activePayments?.length ?? 0;

  return (
    <FlatList
      data={offerings}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => <Offering item={item} disabled={numberOfActivePayments > 0} />}
      onRefresh={refetch}
      refreshing={isRefetchingAppPackages || isRefetchingActivePayments}
    />
  );
}


export function useActivePayments() {
  const query = trpc.payment.activePayments.useQuery(undefined, {
    // Refetches payments when the user's first payment expires so the UI updates
    // to reflect that their premium expired
    refetchInterval(query) {
      const payments = query.state.data;

      if (payments && payments[0]) {
        const expiresAt = new Date(payments[0].expires).getTime();
        const now = new Date().getTime();
        const timeUntilExpires = expiresAt - now;

       if (timeUntilExpires <= 0)  {
         return 1_000;
       } else {
         return timeUntilExpires;
       }
      }

      return false;
    },
  });

  return query;
}
