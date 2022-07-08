import { StackNavigationProp } from "@react-navigation/stack";
import { MainNavParamList } from "../navigators/MainTabs";
import { useNavigation as _useNavigation } from "@react-navigation/native";

export type Navigation = StackNavigationProp<MainNavParamList>;
