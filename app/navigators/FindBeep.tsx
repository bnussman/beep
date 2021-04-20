import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MainFindBeepScreen } from '../routes/ride/FindBeep' 
import { PickBeepScreen } from '../routes/ride/PickBeep'

const Stack = createStackNavigator();

export function FindBeepScreen() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} >
            <Stack.Screen name="MainFindBeepScreen" component={MainFindBeepScreen} />
            <Stack.Screen name="PickBeepScreen" component={PickBeepScreen} />
        </Stack.Navigator>
    );
}
