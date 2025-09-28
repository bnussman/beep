import { useIsSignedIn, useIsSignedOut } from "../utils/useUser";
import { ReportScreen } from "../routes/global/Report";
import { RateScreen } from "../routes/global/Rate";
import { ChangePasswordScreen } from "../routes/settings/ChangePassword";
import { PickBeepScreen } from "../routes/ride/PickBeep";
import { AddCar } from "../routes/cars/AddCar";
import { LoginScreen } from "../routes/auth/Login";
import { SignUpScreen } from "../routes/auth/SignUp";
import { ForgotPasswordScreen } from "../routes/auth/ForgotPassword";
import {
  StaticParamList,
  createStaticNavigation,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Drawer } from "../navigators/Drawer";
import { Appearance } from "react-native";
import { isIOS, isWeb } from "@/utils/constants";
import { BeepDetails } from "@/routes/Beep";

const RootStack = createNativeStackNavigator({
  screens: {},
  screenOptions: () => {
    const colorScheme = Appearance.getColorScheme();
    return {
      headerTintColor: colorScheme === "dark" ? "white" : "black",
      headerBackButtonDisplayMode: "generic",
    };
  },
  groups: {
    SignedIn: {
      if: useIsSignedIn,
      screens: {
        Main: {
          screen: Drawer,
          options: {
            headerShown: false,
          },
        },
        Report: {
          screen: ReportScreen,
          options: {
            presentation: "modal",
          },
        },
        Rate: {
          screen: RateScreen,
          options: {
            presentation: "formSheet",
            headerShown: isWeb,
            sheetGrabberVisible: true,
            sheetInitialDetentIndex: 0,
            sheetAllowedDetents: [0.5, 1] as number[],
          },
        },
        "Change Password": ChangePasswordScreen,
        "Choose Beeper": PickBeepScreen,
        "Add Car": AddCar,
        "Beep Details": {
          screen: BeepDetails,
          options: isIOS
            ? {
                headerTransparent: true,
                title: "",
              }
            : {},
        },
      },
    },
    SignedOut: {
      if: useIsSignedOut,
      screens: {
        Login: {
          screen: LoginScreen,
          options: {
            headerShown: false,
          },
        },
        "Sign Up": SignUpScreen,
        "Forgot Password": ForgotPasswordScreen,
      },
    },
  },
});

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export const Navigation = createStaticNavigation(RootStack);
