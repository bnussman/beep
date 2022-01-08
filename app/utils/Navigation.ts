import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { MainNavParamList } from "../navigators/MainTabs";

export type Navigation = BottomTabNavigationProp<MainNavParamList> & {
  push: any;
};
