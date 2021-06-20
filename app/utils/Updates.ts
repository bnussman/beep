import * as Updates from 'expo-updates';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logger from './Logger';

export async function handleUpdateCheck(): Promise<void> {
    if (!__DEV__) {
        const result = await Updates.checkForUpdateAsync();

        if (result.isAvailable) {
            await handleTokenMove();
            Updates.reloadAsync();
        }
    }
}

async function handleTokenMove() {
    try {
        const data = await AsyncStorage.getItem('@user');

        if (!data) return;

        const userData = JSON.parse(data);
        
        await AsyncStorage.setItem('auth', JSON.stringify({
            id: userData.token,
            tokenid: userData.tokenid
        }));
    }
    catch (error) {
        Logger.error(error);
    }
}
