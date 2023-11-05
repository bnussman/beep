import { useEffect, useState } from "react";
import Purchases, { PurchasesPackage } from "react-native-purchases";
import { Container } from "../components/Container";
import { FlatList, Text } from "native-base";

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