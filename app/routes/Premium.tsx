import React from 'react';
import { useEffect, useState } from "react";
import { Container } from "../components/Container";
import { FlatList, Text } from "native-base";
import { Card } from "../components/Card";
import Purchases, { PurchasesPackage } from "react-native-purchases";

const ENTITLEMENT_ID = "premium";

const PackageItem = ({ purchasePackage }: { purchasePackage: PurchasesPackage }) => {
  const {
    product: { title, description, priceString },
  } = purchasePackage;

  const onSelection = async () => {
    try {
      const p = await Purchases.purchasePackage(purchasePackage);

      alert(JSON.stringify(p));
    } catch (e: any) {
      if (!e.userCancelled) {
        alert(`Error purchasing package ${e.message}`);
      }
    };

    return (
      <Card pressable onPress={onSelection}>
        <Text>{title}</Text>
        <Text>{description}</Text>
        <Text>{priceString}</Text>
      </Card>
    );
  };
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
        renderItem={({ item }) => (<Text>{JSON.stringify(item)}</Text>)}
        keyExtractor={(item) => item.identifier}
      />
    </Container>
  );
}