import * as Updates from 'expo-updates';

export async function handleUpdateCheck(): Promise<void> {
    if (!__DEV__) {
        const result = await Updates.checkForUpdateAsync();
        if (result.isAvailable) Updates.reloadAsync();
    }
}
