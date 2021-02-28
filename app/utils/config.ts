import { Platform } from 'react-native';

export const isMobile: boolean = (Platform.OS == "ios") || (Platform.OS == "android");

export const isAndroid: boolean = Platform.OS == "android";

export const isIOS: boolean = Platform.OS == "ios";

export const config = {
    apiUrl: ( __DEV__ ? 'https://dev.ridebeep.app/v1' : 'https://ridebeep.app/v1'),
    //apiUrl: ( __DEV__ ? 'http://localhost:3001' : 'https://ridebeep.app/v1'),
    baseUrl: ( __DEV__ ? 'https://dev.ridebeep.app/' : 'https://ridebeep.app/')
    //baseUrl: ( __DEV__ ? 'http://192.168.1.57:3000/' : 'https://ridebeep.app/')
};
