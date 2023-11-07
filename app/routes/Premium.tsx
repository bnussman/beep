import React from 'react';
import { useEffect, useState } from "react";
import { Container } from "../components/Container";
import { CheckIcon, FlatList, Spacer, Spinner, Stack, Text } from "native-base";
import { Card } from "../components/Card";
import type { PurchasesPackage } from "react-native-purchases";
import { useUser } from '../utils/useUser';

const PackageItem = ({ purchasePackage }: { purchasePackage: PurchasesPackage }) => {
  const {
    product: { title, description, priceString },
  } = purchasePackage;

  const [isPurchasing, setIsPurchasing] = useState(false);

  const { user } = useUser();

  const onSelection = async () => {
    setIsPurchasing(true);

    try {
      const Purachases: typeof import('react-native-purchases').default = require("react-native-purchases");
      const p = await Purachases.purchasePackage(purchasePackage);
    } catch (e: any) {
      if (!e.userCancelled) {
        alert(`Error purchasing package ${e.message}`);
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <Card pressable onPress={onSelection} mx={2} my={2}>
      <Stack direction="row" alignItems="center">
        <Stack>
          <Text
            fontSize="xl"
            letterSpacing="sm"
            fontWeight="extrabold"
            isTruncated
          >
            {title}
          </Text>
          <Text isTruncated>{description}</Text>
          <Text isTruncated>{priceString}/week</Text>
        </Stack>
        <Spacer />
        {user?.isPremium && <CheckIcon size="5" mt="0.5" color="emerald.500" />}
        {isPurchasing && <Spinner />}
      </Stack>
    </Card>
  );
}

export function Premium() {
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);

  useEffect(() => {
    const getPackages = async () => {
      try {
        const Purchase = (await import("react-native-purchases")).default;
        const offerings = await Purchase.getOfferings();
        if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
          setPackages(offerings.current.availablePackages);
        }
      } catch (e: any) {
        alert(`Error getting offers ${e.message}`);
      }
    };

    getPackages();
  }, []);

  return (
    <Container>
      <FlatList
        data={packages}
        renderItem={({ item }) => <PackageItem purchasePackage={item} />}
        keyExtractor={(item) => item.identifier}
      />
    </Container>
  );
}
