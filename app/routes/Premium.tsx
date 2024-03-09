import React from 'react';
import { useEffect, useState } from "react";
import { Container } from "../components/Container";
import { Card, Image, Spacer, Spinner, Stack, Text, Button, Heading, XStack } from "@beep/ui";
import type { PurchasesOffering, PurchasesPackage } from "react-native-purchases";
import PremiumImage from '../assets/premium.png';
import { Logger } from '../utils/Logger';
import { useMutation, useQuery } from '@apollo/client';
import { Countdown } from '../components/CountDown';
import { FlatList, RefreshControl, useColorScheme } from 'react-native';
import { useUser } from '../utils/useUser';
import { graphql } from 'gql.tada';
import { Check } from '@tamagui/lucide-icons';

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
    <Card m="$2">
      <Stack gap="$2">
        <Heading fontWeight="bold">
          {item.identifier}
        </Heading>
        <Text>Promotes you to the top of the beeper list so you get more riders joining your queue</Text>
        <Text fontSize="$1">Goes into effect immediately upon purchase</Text>
        <Image source={PremiumImage} height="300px" resizeMode="contain" alt="beep screenshot of premium" mb={1} />
        {packages.map((p) => <Package key={p.identifier} p={p} />)}
      </Stack>
    </Card>
  );
};

function Package({ p }: { p: PurchasesPackage }) {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [checkVerificationStatus] = useMutation(CheckVerificationStatus);
  const { user } = useUser();

  const { data, refetch } = useQuery(PaymentsQuery, { variables: { id: user?.id ?? "" } });

  const payment = data?.getPayments.items.find(sub => sub.productId === p.product.identifier);

  const countdown = payment?.expires ? <Countdown date={new Date(payment.expires as string)} /> : null;

  const onBuy = async (item: PurchasesPackage) => {
    if (Boolean(payment)) {
      return alert("You are already promoted on the beeper list.");
    }

    setIsPurchasing(true);

    try {
      const Purchases: typeof import('react-native-purchases').default = require("react-native-purchases").default;
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
    <Card p={3} py={2}>
      <XStack alignItems="center" gap="$2">
        <Heading>{p.identifier}</Heading>
        <Text>{countdown}</Text>
        <Spacer />
        {Boolean(payment) && <Check size="4" color="$green9" />}
        <Button iconAfter={isPurchasing ? <Spinner /> : undefined} onPress={() => onBuy(p)} disabled={Boolean(payment)}>{p.product.priceString}</Button>
      </XStack>
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
      const Purchases: typeof import('react-native-purchases').default = require("react-native-purchases").default;
      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
        const topOfBeeperListPackages: PurchasesOffering[] = Object.values(offerings.all);
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
  const { user } = useUser();
  const { refetch: refetchUserPayments, loading } = useQuery(PaymentsQuery, { variables: { id: user?.id ?? "" }, notifyOnNetworkStatusChange: true });
  const { offerings, error, isLoading, refetch: refetchAppPackages, isRefreshing } = usePackages();

  const colorMode = useColorScheme();

  const refetch = () => {
    refetchUserPayments();
    refetchAppPackages();
  };

  if (isLoading && !offerings) {
    return (
      <Container center>
        <Spinner />
      </Container>
    );
  }

  if (error) {
    return (
      <Container center>
        <Text>{error}</Text>
      </Container>
    );
  }

  return (
    <Container center>
      <FlatList
        data={offerings}
        renderItem={({ item }) => <Offering item={item} />}
        onRefresh={refetch}
        refreshing={isRefreshing || loading}
        refreshControl={
          <RefreshControl
            tintColor={colorMode === "dark" ? "#cfcfcf" : undefined}
            refreshing={isRefreshing || loading}
            onRefresh={refetch}
          />
        }
      />
    </Container>
  );
}
