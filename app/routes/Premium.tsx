import React from 'react';
import { useEffect, useState } from "react";
import { Container } from "../components/Container";
import { Image, CheckIcon, Spacer, Spinner, Stack, Text, FlatList, useColorMode, Button, Heading } from "native-base";
import type { PurchasesOffering, PurchasesPackage } from "react-native-purchases";
import PremiumImage from '../assets/premium.png';
import { Card } from '../components/Card';
import { Logger } from '../utils/Logger';
import { gql, useMutation, useQuery } from '@apollo/client';
import { CheckUserSubscriptionsMutation, PaymentsQueryQuery } from '../generated/graphql';
import { Countdown } from '../components/CountDown';
import { RefreshControl } from 'react-native';
import { useUser } from '../utils/useUser';

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
        <Heading fontSize="xl" letterSpacing="sm" fontWeight="extrabold">
          {item.identifier}
        </Heading>
        <Text>Promotes you to the top of the beeper list so you get more riders joining your queue</Text>
        <Text fontSize="xs">Goes into effect immediately upon purchase</Text>
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
      <Stack direction="row" alignItems="center" space={2}>
        <Heading fontSize="lg">{p.identifier}</Heading>
        <Text>{countdown}</Text>
        <Spacer />
        {Boolean(payment) && <CheckIcon size="6" color="emerald.500" />}
        <Button isLoading={isPurchasing} onPress={() => onBuy(p)} isDisabled={Boolean(payment)}>{p.product.priceString}</Button>
      </Stack>
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

  const { colorMode } = useColorMode();

  if (isLoading && !offerings) {
    return (
      <Container center>
        <Spinner size="lg" />
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
        w="100%"
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
