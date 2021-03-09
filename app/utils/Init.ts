import * as SplashScreen from 'expo-splash-screen';
import { handleUpdateCheck } from './Updates';

export default function init(): void {
    handleUpdateCheck();
    SplashScreen.preventAutoHideAsync();
}
