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
import { useMutation, useQuery } from "@apollo/client";
import { Countdown } from "../components/CountDown";
import { FlatList, RefreshControl } from "react-native";
import { graphql } from "gql.tada";
import { trpc } from "@/utils/trpc";

interface Props {
  item: PurchasesOffering;
}

const CheckVerificationStatus = graphql(`
  mutation checkUserSubscriptions {
    checkUserSubscriptions {
      id
      expires
    }
  }
`);

const PaymentsQuery = graphql(`
  query PaymentsQuery($id: String) {
    getPayments(id: $id) {
      items {
        id
        productId
        expires
      }
    }
  }
`);

function Offering({ item }: Props) {
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
        <Package key={p.identifier} p={p} />
      ))}
    </Card>
  );
}

function Package({ p }: { p: PurchasesPackage }) {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [checkVerificationStatus] = useMutation(CheckVerificationStatus);
  const { data: user } = trpc.user.useQuery();

  const { data, refetch } = useQuery(PaymentsQuery, {
    variables: { id: user?.id ?? "" },
  });

  const payment = data?.getPayments.items.find(
    (sub) => sub.productId === p.product.identifier,
  );

  const countdown = payment?.expires ? (
    <Countdown date={new Date(payment.expires as string)} />
  ) : null;

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
        disabled={Boolean(payment)}
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

  return { offerings, error, isLoading, refetch: getOfferings, isRefreshing };
}

export function Premium() {
  const { data: user } = trpc.user.useQuery();
  const { refetch: refetchUserPayments, loading } = useQuery(PaymentsQuery, {
    variables: { id: user?.id ?? "" },
    notifyOnNetworkStatusChange: true,
  });
  const {
    offerings,
    error,
    isLoading,
    refetch: refetchAppPackages,
    isRefreshing,
  } = usePackages();

  const refetch = () => {
    refetchUserPayments();
    refetchAppPackages();
  };

  if (isLoading && !offerings) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={offerings}
      contentContainerClassName="p-4"
      renderItem={({ item }) => <Offering item={item} />}
      onRefresh={refetch}
      refreshing={isRefreshing || loading}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing || loading}
          onRefresh={refetch}
        />
      }
    />
  );
}
