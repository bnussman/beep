export default {
  name: "Beep",
  displayName: "Beep",
  expo: {
    name: "Beep",
    slug: "Beep",
    owner: "bnussman",
    version: "2.0.1",
    githubUrl: "https://github.com/bnussman/Beep",
    primaryColor: "#ecc94b",
    icon: "./assets/icon.png",
    notification: {
      iosDisplayInForeground: true
    },
    extra: {
      GOOGLE_API_KEYS: process.env.GOOGLE_API_KEYS,
    },
    platforms: [
      "ios",
      "android",
      "web"
    ],
    web: {
      favicon: "./assets/favicon.png"
    },
    hooks: {
      postPublish: [
        {
          file: "sentry-expo/upload-sourcemaps",
          config: {
            url: "https://sentry.nussman.us",
            setCommits: true,
            organization: "beep",
            project: "beep-app",
            authToken: "4b73e552aebd48a7973e39c0a322a3539623979525144fa7b7b3f9eb44907b2a"
          }
        }
      ]
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "app.ridebeep.App",
      buildNumber: "11",
      infoPlist: {
        NSLocationWhenInUseUsageDescription: "The Beep App uses your location to pick origins, destinations, and predict ride times",
        NSLocationAlwaysUsageDescription: "The Beep App will use your location to provide ETA's to yourself and others",
        NSLocationAlwaysAndWhenInUseUsageDescription: "The Beep App will use your location to provide ETA's to yourself and others",
        UIBackgroundModes: [
          "location",
          "fetch"
        ]
      }
    },
    android: {
      package: "app.ridebeep.App",
      versionCode: 29,
      googleServicesFile: "./google-services.json",
      useNextNotificationsApi: true,
      permissions: [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "ACCESS_BACKGROUND_LOCATION",
        "FOREGROUND_SERVICE",
        "VIBRATE"
      ]
    },
    splash: {
      image: "./assets/splash.png",
      resizeMode: "cover",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ]
  },
}
