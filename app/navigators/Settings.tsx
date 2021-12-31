import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { MainSettingsScreen } from "../routes/settings/Settings";

const Stack = createStackNavigator();

export function SettingsScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainSettingsScreen" component={MainSettingsScreen} />
    </Stack.Navigator>
  );
}
