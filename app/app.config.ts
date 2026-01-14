import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  experiments: {
    tsconfigPaths: true,
    reactCompiler: true,
  },
  name: "Beep",
  slug: "Beep",
  scheme: "beep",
  owner: "bnussman",
  version: "2.18.2",
  githubUrl: "https://github.com/bnussman/Beep",
  primaryColor: "#575A62",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  notification: {
    iosDisplayInForeground: true,
  },
  updates: {
    url: "https://u.expo.dev/2c7a6adb-2579-43f1-962e-b23c7e541ec4",
    fallbackToCacheTimeout: 10_000,
  },
  runtimeVersion: {
    policy: "sdkVersion",
  },
  extra: {
    eas: {
      projectId: "2c7a6adb-2579-43f1-962e-b23c7e541ec4",
    },
  },
  platforms: ["ios", "android", "web"],
  web: {
    favicon: "./assets/favicon.png",
    bundler: "metro",
  },
  plugins: [
    ["expo-notifications"],
    [
      "react-native-maps",
      {
        iosGoogleMapsApiKey: "AIzaSyDpCZoq8gSeOxpqHzk1VBoC3XgajTcSjf0",
        androidGoogleMapsApiKey: "AIzaSyCZGVtB12HMoeJ_9aIW9jdyue8Vc_XMNxc",
      },
    ],
    [
      "expo-location",
      {
        isIosBackgroundLocationEnabled: true,
        isAndroidBackgroundLocationEnabled: true,
        isAndroidForegroundServiceEnabled: true,
      },
    ],
    [
      "voltra",
      {
        enablePushNotifications: true,
      },
    ],
    [
      "@sentry/react-native/expo",
      {
        url: "https://sentry.io/",
        project: "app",
        organization: "ian-banks-llc",
      },
    ],
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "app.ridebeep.App",
    buildNumber: "35",
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      NSLocationWhenInUseUsageDescription:
        "The Beep App uses your location to pick origins, destinations, and predict ride times",
      NSLocationAlwaysUsageDescription:
        "The Beep App will use your location to provide ETA's to yourself and others",
      NSLocationAlwaysAndWhenInUseUsageDescription:
        "The Beep App will use your location to provide ETA's to yourself and others",
      UIBackgroundModes: ["location", "fetch"],
    },
    config: {
      googleMapsApiKey: "AIzaSyDpCZoq8gSeOxpqHzk1VBoC3XgajTcSjf0",
    },
    icon: {
      light: "./assets/icon.png",
      dark: "./assets/icon-transparent.png",
      tinted: "./assets/icon-tinted.png",
    },
    splash: {
      image: "./assets/splash.png",
      resizeMode: "cover",
      backgroundColor: "#ffffff",
      dark: {
        image: "./assets/splash.png",
        resizeMode: "cover",
        backgroundColor: "#000000",
      },
    },
  },
  android: {
    package: "app.ridebeep.App",
    versionCode: 55,
    googleServicesFile: "./google-services.json",
    permissions: [
      "ACCESS_COARSE_LOCATION",
      "ACCESS_FINE_LOCATION",
      "ACCESS_BACKGROUND_LOCATION",
      "FOREGROUND_SERVICE_LOCATION",
      "FOREGROUND_SERVICE",
      "VIBRATE",
    ],
    config: {
      googleMaps: {
        apiKey: "AIzaSyCZGVtB12HMoeJ_9aIW9jdyue8Vc_XMNxc",
      },
    },
    splash: {
      image: "./assets/splash.png",
      resizeMode: "cover",
      backgroundColor: "#ffffff",
      dark: {
        image: "./assets/splash.png",
        resizeMode: "cover",
        backgroundColor: "#000000",
      },
    },
  },
  assetBundlePatterns: ["**/*"],
};

export default config;
