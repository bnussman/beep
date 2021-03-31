import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { Vibration, Platform } from 'react-native';
import { gql } from '@apollo/client';
import { client } from '../utils/Apollo';
import { isMobile } from './config';

/**
 * Checks for permssion for Notifications, asks expo for push token, sets up notification listeners, returns 
 * push token to be used
 */
export async function getPushToken(): Promise<string | null> {
    const hasPermission = await getNotificationPermission();

    if(!hasPermission) {
        return null;
    }

    const pushToken = await Notifications.getExpoPushTokenAsync();

    setNotificationHandlers();

    return pushToken.data;
}

/**
 * function to get existing or prompt for notification permission
 * @returns boolean true if client has location permissions
 */
async function getNotificationPermission() {
    if (!Constants.isDevice) {
        return false;
    }

    //TODO better fix
    if(Platform.OS == "android") {
        return true;
    }

    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

    let finalStatus = status;

    if (status !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.log('[App.js] [Push Notifications] Failed to get push token for push notification!');
        return false;
    }
    return true;
}

/**
 * Set listiner function(s)
 */
function setNotificationHandlers() {
    const enteredBeeperQueueActions = [
        {
            actionId: "accept",
            identifiter: "accept",
            buttonTitle: "Accept"
        },
        {
            actionId: "deny",
            identifiter: "deny",
            buttonTitle: "Deny",
            options: {
                isDestructive: true
            }
        }

    ];
    //@ts-ignore
    Notifications.setNotificationCategoryAsync("enteredBeeperQueue", enteredBeeperQueueActions);
    //@ts-ignore
    Notifications.addNotificationReceivedListener(handleNotification);
}

/**
 * call getPushToken and send to backend
 * @param token a user's auth token
 */
export async function updatePushToken(): Promise<void> {
    if (isMobile) {
        const UpdatePushToken = gql`
        mutation UpdatePushToken($token: String!) {
            updatePushToken (pushToken: $token)
        }
        `;

        await client.mutate({ mutation: UpdatePushToken, variables: { token: await getPushToken() }});
    }
}

async function handleNotification(notification: Notification): Promise<void> {
    //Vibrate when we recieve a notification
    Vibration.vibrate();
    //Log the entire notification to the console
    //console.log("Notification:", notification);
}
