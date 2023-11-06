import React from 'react';
import { useEffect, useState } from "react";
import { Container } from "../components/Container";
import { FlatList, Spacer, Spinner, Stack, Text } from "native-base";
import { Card } from "../components/Card";
import Purchases, { PurchasesPackage } from "react-native-purchases";

const PackageItem = ({ purchasePackage }: { purchasePackage: PurchasesPackage }) => {
  const {
    product: { title, description, priceString },
  } = purchasePackage;

  const [isPurchasing, setIsPurchasing] = useState(false);

  const onSelection = async () => {
    setIsPurchasing(true);
    try {
      const p = await Purchases.purchasePackage(purchasePackage);

      alert(JSON.stringify(p));
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
      <Stack direction="row">
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
