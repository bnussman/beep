import { Pressable, View } from "react-native";
import { Label } from "./Label";
import { Menu } from "./Menu";
import { Input } from "./Input";
import { useUser } from "@/utils/useUser";
import { skipToken, useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { orpc } from "@/utils/orpc";

export function CarSelect() {
  const { user } = useUser();
  const router = useRouter();

  const { data: cars } = useQuery(
    orpc.car.cars.queryOptions({
      input: user ? { userId: user.id } : skipToken
    }),
  );

  const { mutate } = useMutation(
    orpc.car.updateCar.mutationOptions({
      onSuccess(data, variables, onMutateResult, context) {
        context.client.invalidateQueries({
          queryKey: orpc.car.cars.key(),
        });
      },
    }),
  );

  const defaultCar = cars?.cars.find((car) => car.default);

  return (
    <View style={{ gap: 4 }}>
      <Label htmlFor="car">Car</Label>
      <Menu
        trigger={({ onPress }) => (
          <Pressable accessibilityRole="button" onPress={onPress}>
            <Input
              id="car"
              readOnly
              value={defaultCar ? `${defaultCar.year} ${defaultCar.make} ${defaultCar.model}` : ""}
              placeholder="Select a car"
            />
          </Pressable>
        )}
        options={
          cars?.results === 0
            ? [
                {
                  title: "Create a new car",
                  onClick: () => router.navigate("/profile/cars/create"),
                },
              ]
            : (cars?.cars.map((car) => ({
                title: `${car.year} ${car.make} ${car.model}`,
                onClick: () =>
                  mutate({ carId: car.id, data: { default: true } }),
                checked: car.id === defaultCar?.id,
              })) ?? [])
        }
      />
    </View>
  );
}
