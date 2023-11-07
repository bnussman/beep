import React from 'react';
import { useEffect, useState } from "react";
import { Container } from "../components/Container";
import { CheckIcon, Spacer, Image, Spinner, Stack, Text, Button } from "native-base";
import type { PurchasesPackage } from "react-native-purchases";
import { useUser } from '../utils/useUser';
import PremiumImage from '../assets/premium.png';

export function Premium() {
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);

  const [isPurchasing, setIsPurchasing] = useState(false);

  const { user } = useUser();

  useEffect(() => {
    const getPackages = async () => {
      try {
        const Purchases: typeof import('react-native-purchases').default = require("react-native-purchases").default;
        const offerings = await Purchases.getOfferings();
        if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
          setPackages(offerings.current.availablePackages);
        }
      } catch (e: any) {
        alert(`Error getting offers ${e.message}`);
      }
    };

    getPackages();
  }, []);

  const onBuy = async () => {
    setIsPurchasing(true);

    try {
      const Purchases: typeof import('react-native-purchases').default = require("react-native-purchases").default;
      const p = await Purchases.purchasePackage(packages[0]);
    } catch (e: any) {
      if (!e.userCancelled) {
        alert(`Error purchasing package ${e.message}`);
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  if (!packages[0]) {
    return (
      <Container center>
        <Spinner size="lg" />
      </Container>
    );
  }

  return (
    <Container center>
      <Stack alignItems="center" justifyContent="center" space={4} pt={4}>
        <Text
          fontSize="2xl"
          letterSpacing="sm"
          fontWeight="extrabold"
          isTruncated
        >
          {packages[0].product.title}
        </Text>
        <Text isTruncated>{packages[0].product.description}</Text>
        <Text isTruncated>{packages[0].product.priceString}/week</Text>
        {!user?.isPremium && <Button onPress={onBuy} isLoading={isPurchasing}>Subscribe</Button>}
        {user?.isPremium && <CheckIcon size="5" mt="0.5" color="emerald.500" />}
        <Image source={PremiumImage} height="500px" resizeMode="contain" alt="beep screenshot of premium" />
      </Stack>
      <Spacer />
    </Container>
  );
}
