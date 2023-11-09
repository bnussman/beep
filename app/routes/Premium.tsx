import React from 'react';
import { useEffect, useState } from "react";
import { Container } from "../components/Container";
import { Image, CheckIcon, Spacer, Spinner, Stack, Text, FlatList } from "native-base";
import type { PurchasesPackage } from "react-native-purchases";
import { useUser } from '../utils/useUser';
import PremiumImage from '../assets/premium.png';
import { Card } from '../components/Card';
import { Logger } from '../utils/Logger';
import { gql, useMutation, useQuery } from '@apollo/client';
import { CheckUserSubscriptionsMutation, TopOfQueueStatusQuery } from '../generated/graphql';
import { Countdown } from '../components/CountDown';

interface Props {
  item: PurchasesPackage;
}

const CheckVerificationStatus = gql`
  mutation checkUserSubscriptions {
    checkUserSubscriptions {
      id
      expires
    }
  }
`;

const TopOfQueueStatus = gql`
  query TopOfQueueStatus  {
    getTopOfQueueStatus {
      id
      expires
    }
  }
`;

function Package({ item }: Props) {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { user } = useUser();

  const [checkVerificationStatus] = useMutation<CheckUserSubscriptionsMutation>(CheckVerificationStatus);
  const { data: status, refetch } = useQuery<TopOfQueueStatusQuery>(TopOfQueueStatus);

  const onBuy = async (item: PurchasesPackage) => {
    if (status?.getTopOfQueueStatus?.expires) {
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

  const expires = status?.getTopOfQueueStatus?.expires;

  return (
    <Card m={2} pb={0} pressable onPress={() => onBuy(item)}>
      <Stack direction="row" alignItems="center" mb={2}>
        <Stack space={1} flexShrink={1}>
          <Text fontSize="xl" letterSpacing="sm" fontWeight="extrabold">
            {item.product.title}
          </Text>
          {/* <Text>{item.product.description}</Text> */}
          <Text>Promotes you to the top of the beeper list so you get more riders joining your queue.</Text>
          <Text italic>{item.product.priceString}</Text>
          <Text>{expires ? <Countdown date={new Date(expires)} /> : ''}</Text>
        </Stack>
        <Spacer />
        {!isPurchasing && user?.isPremium && <CheckIcon size="6" color="emerald.500" />}
        {isPurchasing && <Spinner />}
      </Stack>
      <Image source={PremiumImage} height="300px" resizeMode="contain" alt="beep screenshot of premium" />
    </Card>
  );
};

function usePackages() {
  const [packages, setPackages] = useState<PurchasesPackage[]>();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);

  const isRefreshing = Boolean(packages) && isLoading;

  const getPackages = async () => {
    if (!isLoading) {
      setIsLoading(true);
    }
    try {
      const Purchases: typeof import('react-native-purchases').default = require("react-native-purchases").default;
      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
        setPackages(offerings.current.availablePackages);
      }
    } catch (e) {
      Logger.error(e);
      setError("Unable to load offerings.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPackages();
  }, []);

  return { packages, error, isLoading, refetch: getPackages, isRefreshing };
}

export function Premium() {
  const { packages, error, isLoading, refetch, isRefreshing } = usePackages();

  if (isLoading && !packages) {
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
        data={packages}
        w="100%"
        renderItem={({ item }) => <Package item={item} />}
        onRefresh={refetch}
        refreshing={isRefreshing}
      />
    </Container>
  );
}
