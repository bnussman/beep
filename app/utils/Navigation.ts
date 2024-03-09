import { useIsSignedIn, useIsSignedOut } from "../utils/useUser";
import { ProfileScreen } from "../routes/global/Profile";
import { ReportScreen } from "../routes/global/Report";
import { RateScreen } from "../routes/global/Rate";
import { ChangePasswordScreen } from "../routes/settings/ChangePassword";
import { PickBeepScreen } from "../routes/ride/PickBeep";
import { AddCar } from "../routes/cars/AddCar";
import { LoginScreen } from "../routes/auth/Login";
import { SignUpScreen } from "../routes/auth/SignUp";
import { ForgotPasswordScreen } from "../routes/auth/ForgotPassword";
import { StaticParamList, createStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Drawer } from "../navigators/Drawer";
import { Appearance } from "react-native";

const RootStack = createNativeStackNavigator({
  screens: {
    // This is stupid but it has to go here rather than the signed in group because logout will crash the ios app
    Login: {
      if: useIsSignedOut,
      screen: LoginScreen,
      options: {
        headerShown: false,
      },
    },
  },
  screenOptions: () => {
    const colorScheme = Appearance.getColorScheme();
    return {
      headerTintColor: colorScheme === "dark" ? "white" : "black",
    }
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
        User: ProfileScreen,
        Report: {
          screen: ReportScreen,
          options: {
            presentation: 'modal',
          }
        },
        Rate: {
          screen: RateScreen,
          options: {
            presentation: 'modal',
          }
        },
        "Change Password": ChangePasswordScreen,
        "Choose Beeper": PickBeepScreen,
        "Add Car": AddCar,
      },
    },
    SignedOut: {
      if: useIsSignedOut,
      screens: {
        'Sign Up': SignUpScreen,
        'Forgot Password': ForgotPasswordScreen,
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
