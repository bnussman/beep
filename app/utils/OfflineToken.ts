import AsyncStorage from '@react-native-community/async-storage';
import { config } from './config';

export async function removeOldToken(): Promise<void> {
    try {
        const tokenid = await AsyncStorage.getItem('@tokenid');

        if (tokenid !== null) {
            try {
                const result = await fetch(config.apiUrl + "/auth/token", {
                    method: "POST",
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ tokenid: tokenid })
                });

                const data = await result.json();

                if (data.status == "success") {
                    AsyncStorage.removeItem("@tokenid");
                }
            }
            catch (error) {
                console.log("Error");
            }
        }
    }
    catch (error) {
        console.log("[OfflineToken.js] [AsyncStorage] ", error);
    }
}
