export default {
  name: "Beep",
  displayName: "Beep",
  expo: {
    name: "Beep",
    slug: "Beep",
    owner: "bnussman",
    version: "2.0.0",
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
            project: "app",
            authToken: "9ed67c2ab12d4d54b50cd95ed81aef0ea5d796a75bd84647a48880239bdf5203"
          }
        }
      ]
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "app.ridebeep.App",
      buildNumber: "10",
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
      versionCode: 27,
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
