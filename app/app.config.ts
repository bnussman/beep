export default {
  name: "Beep",
  displayName: "Beep",
  expo: {
    name: "Beep",
    slug: "Beep",
    owner: "bnussman",
    version: "2.6.0",
    githubUrl: "https://github.com/bnussman/Beep",
    primaryColor: "#575A62",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    notification: {
      iosDisplayInForeground: true,
    },
    extra: {
      GOOGLE_API_KEYS: process.env.GOOGLE_API_KEYS,
      eas: {
        projectId: "2c7a6adb-2579-43f1-962e-b23c7e541ec4",
      },
    },
    platforms: ["ios", "android", "web"],
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: ["sentry-expo"],
    hooks: {
      postPublish: [
        {
          file: "sentry-expo/upload-sourcemaps",
          config: {
            setCommits: true,
            organization: "ian-banks-llc",
            project: "app",
          },
        },
      ],
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "app.ridebeep.App",
      buildNumber: "17",
      infoPlist: {
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
    },
    android: {
      package: "app.ridebeep.App",
      versionCode: 35,
      googleServicesFile: "./google-services.json",
      permissions: [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "ACCESS_BACKGROUND_LOCATION",
        "FOREGROUND_SERVICE",
        "VIBRATE",
      ],
      config: {
        googleMaps: {
          apiKey: "AIzaSyCZGVtB12HMoeJ_9aIW9jdyue8Vc_XMNxc",
        },
      },
    },
    splash: {
      image: "./assets/splash.png",
      resizeMode: "cover",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
  },
};
