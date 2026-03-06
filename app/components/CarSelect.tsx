import React from "react";
import { View } from "react-native";
import { Label } from "./Label";
import { Menu } from "./Menu";
import { Input } from "./Input";
import { useUser } from "@/utils/useUser";
import { skipToken, useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";
import { useRouter } from "expo-router";

export function CarSelect() {
  const { user } = useUser();
  const trpc = useTRPC();
  const router = useRouter();

  const { data: cars } = useQuery(
    trpc.car.cars.queryOptions(user ? { userId: user.id } : skipToken)
  );

  const { mutate } = useMutation(
    trpc.car.updateCar.mutationOptions({
      onSuccess(data, variables, onMutateResult, context) {
        context.client.invalidateQueries({
          queryKey: trpc.car.cars.pathKey()
        })
      },
    })
  );

  const defaultCar = cars?.cars.find((car) => car.default);

  return (
    <View style={{ gap: 4 }}>
      <Label htmlFor="car">Car</Label>
      <Menu
        trigger={
          <Input
            id="car"
            readOnly
            value={defaultCar ? ` ${defaultCar.year} ${defaultCar.make} ${defaultCar.model}` : ''}
            placeholder="Select a car"
          />
        }
        options={
          cars?.results === 0
            ? [{ title: "Create a new car", onClick: () => router.navigate('/profile/cars/create') }]
            : cars?.cars.map((car) => ({
              title: `${car.year} ${car.make} ${car.model}`,
              onClick: () => mutate({ carId: car.id, data: { default: true }}),
              checked: car.id === defaultCar?.id,
            })) ?? []
        }
      />
    </View>
  );
}