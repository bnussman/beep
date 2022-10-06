import { createStackNavigator } from "@react-navigation/stack";
import { AddCar } from "./AddCar";
import { Cars } from "./Cars";

const Stack = createStackNavigator();

export function CarsRouter() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Cars" component={Cars} />
      <Stack.Screen name="Add Car" component={AddCar} />
    </Stack.Navigator>
  );
}
