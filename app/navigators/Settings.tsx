import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MainSettingsScreen } from '../routes/settings/Settings'
import { EditProfileScreen } from '../routes/settings/EditProfile'
import { ProfilePhotoScreen } from '../routes/settings/ProfilePhoto'
import { ChangePasswordScreen } from '../routes/settings/ChangePassword'
import { BeepHistoryNavigator } from './BeepHistory'
import {RatingsNavigator} from './Ratings';

const Stack = createStackNavigator();

export function SettingsScreen() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} >
        <Stack.Screen name="MainSettingsScreen" component={MainSettingsScreen} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
        <Stack.Screen name="ProfilePhotoScreen" component={ProfilePhotoScreen} />
        <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
        <Stack.Screen name="RideLogScreen" component={BeepHistoryNavigator} />
        <Stack.Screen name="RatingsScreen" component={RatingsNavigator} />
        </Stack.Navigator>
    );
}
