import { SplashScreen } from 'expo-router';
import { useUser } from '@/utils/useUser';

SplashScreen.preventAutoHideAsync();

export function SplashScreenController() {
  const { isLoading } = useUser();

  if (!isLoading) {
    SplashScreen.hide();
  }

  return null;
}