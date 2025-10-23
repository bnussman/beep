import { useTheme } from "@/utils/theme";
import { Button, Host, Image } from "@expo/ui/swift-ui";
import { View } from "react-native";

export function Elipsis() {
  const theme = useTheme();
  // return (
  //   <Button variant="glass" systemImage="ellipsis" controlSize="extraLarge" />
  // );
  return <Image systemName="ellipsis" color={theme.text.primary} size={24} />;
}
