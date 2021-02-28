import * as SplashScreen from 'expo-splash-screen';
import { initializeSentry } from './Sentry';

export default function init(): void {
    initializeSentry();
    SplashScreen.preventAutoHideAsync()
        .then(result => console.log(`SplashScreen.preventAutoHideAsync() succeeded: ${result}`))
        .catch(console.warn);
}
