import React from 'react';
import { useEffect, useState } from "react";
import { Container } from "../components/Container";
import { Image, Spacer, Spinner, Stack, Text, Button, SizableText, H3, XStack, H4 } from "tamagui";
import type { PurchasesOffering, PurchasesPackage } from "react-native-purchases";
import PremiumImage from '../assets/premium.png';
import { Card } from '../components/Card';
import { Logger } from '../utils/Logger';
import { gql, useMutation, useQuery } from '@apollo/client';
import { CheckUserSubscriptionsMutation, PaymentsQueryQuery } from '../generated/graphql';
import { Countdown } from '../components/CountDown';
import { FlatList, RefreshControl, useColorScheme } from 'react-native';
import { useUser } from '../utils/useUser';
import { Feather } from '@expo/vector-icons';

interface Props {
  item: PurchasesOffering;
}

const CheckVerificationStatus = gql`
  mutation checkUserSubscriptions {
    checkUserSubscriptions {
      id
      expires
    }
  }
`;

const PaymentsQuery = gql`
  query PaymentsQuery($id: String) {
    getPayments(id: $id) {
      items {
        id
        productId
        expires
      }
    }
  }
`;

function Offering({ item }: Props) {
  const packages = item.availablePackages;

  return (
    <Card m={2}>
      <Stack space={2}>
        <H3>{item.identifier}</H3>
        <SizableText>Promotes you to the top of the beeper list so you get more riders joining your queue</SizableText>
        <SizableText fontSize="$2">Goes into effect immediately upon purchase</SizableText>
        <Image source={PremiumImage} height="300px" resizeMode="contain" alt="beep screenshot of premium" mb={1} />
        {packages.map((p) => <Package key={p.identifier} p={p} />)}
      </Stack>
    </Card>
  );
};

function Package({ p }: { p: PurchasesPackage }) {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [checkVerificationStatus] = useMutation<CheckUserSubscriptionsMutation>(CheckVerificationStatus);
  const { user } = useUser();

  const { data, refetch } = useQuery<PaymentsQueryQuery>(PaymentsQuery, { variables: { id: user?.id ?? "" } });

  const payment = data?.getPayments.items.find(sub => sub.productId === p.product.identifier);

  const countdown = payment?.expires ? <Countdown date={new Date(payment.expires)} /> : null;

  const onBuy = async (item: PurchasesPackage) => {
    if (Boolean(payment)) {
      return alert("You are already promoted on the beeper list.");
    }

    setIsPurchasing(true);

    try {
      const Purchases: typeof import('react-native-purchases').default = require("react-native-purchases").default;
      await Purchases.purchasePackage(item);
      await checkVerificationStatus();
      refetch();
    } catch (e: any) {
      if (!e.userCancelled) {
        Logger.error(e);
        alert(`Error purchasing package ${e.message}`);
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <Card p={3} py={2}>
      <XStack alignItems="center" space={2}>
        <H4>{p.identifier}</H4>
        <SizableText>{countdown}</SizableText>
        <Spacer />
        {Boolean(payment) && <Feather name="check" size={20} color="green" />}
        <Button isLoading={isPurchasing} onPress={() => onBuy(p)} isDisabled={Boolean(payment)}>{p.product.priceString}</Button>
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
  const { offerings, error, isLoading, refetch, isRefreshing } = usePackages();

  const colorMode = useColorScheme();

  if (isLoading && !offerings) {
    return (
      <Container center>
        <Spinner size="small" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container center>
        <SizableText>{error}</SizableText>
      </Container>
    );
  }

  return (
    <Container center>
      <FlatList
        data={offerings}
        renderItem={({ item }) => <Offering item={item} />}
        onRefresh={refetch}
        refreshing={isRefreshing}
        refreshControl={
          <RefreshControl
            tintColor={colorMode === "dark" ? "#cfcfcf" : undefined}
            refreshing={isRefreshing}
            onRefresh={refetch}
          />
        }
      />
    </Container>
  );
}
