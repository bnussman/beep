import { useIsSignedIn, useIsSignedOut } from "../utils/useUser";
import { ReportScreen } from "../app/(app)/user/[id]/report";
import { RateScreen } from "../app/(app)/user/[id]/rate";
import { ChangePasswordScreen } from "../app/(app)/profile/change-password";
import { PickBeepScreen } from "../routes/ride/PickBeep";
import { AddCar } from "../app/(app)/cars/create";
import { LoginScreen } from "../routes/auth/Login";
import { SignUpScreen } from "../routes/auth/SignUp";
import { ForgotPasswordScreen } from "../routes/auth/ForgotPassword";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Drawer } from "../components/Drawer";
import { Appearance } from "react-native";
import { isIOS, isWeb } from "@/utils/constants";
import { BeepDetails } from "@/app/(app)/beeps/[id]";
import {
  StaticParamList,
  createStaticNavigation,
} from "@react-navigation/native";
import { User } from "@/app/(app)/user/[id]";
import { UserMenu, useUserMenuOptions } from "@/components/UserMenu";
import { getNavigationMenuFromOptions } from "@/components/Menu.utils";

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
            presentation: "formSheet",
            headerShown: isWeb,
            sheetGrabberVisible: true,
            sheetInitialDetentIndex: 0,
            sheetAllowedDetents: [0.5, 1] as number[],
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
        User: {
          screen: User,
          options: ({ route }) => ({
            headerRight: () => (
              <UserMenu userId={(route.params as { id: string })?.id} />
            ),
            unstable_headerRightItems: () => {
              const options = useUserMenuOptions(
                (route.params as { id: string }).id,
              );
              return getNavigationMenuFromOptions(options);
            },
            headerTransparent: true,
          }),
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
