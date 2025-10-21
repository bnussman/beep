import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Menu } from "@/components/Menu";
import { Alert } from "react-native";
import { useTRPC } from "@/utils/trpc";
import { useNavigation } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LOCATION_TRACKING } from "@/utils/location";
import { isMobile } from "@/utils/constants";
import { Elipsis } from "@/components/Elipsis";

export function ProfileMenu() {
  const trpc = useTRPC();
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const { mutate: deleteAccount } = useMutation(
    trpc.user.deleteMyAccount.mutationOptions({
      onSuccess() {
        AsyncStorage.clear();

        Location.stopLocationUpdatesAsync(LOCATION_TRACKING);

        queryClient.resetQueries();
      },
      onError(error) {
        alert(error.message);
      },
    }),
  );

  const handleDeleteWrapper = () => {
    if (isMobile) {
      Alert.alert(
        "Delete Your Account?",
        "Are you sure you want to delete your account? We will delete all of your account data. It will not be kept.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: () => deleteAccount(),
            style: "destructive",
          },
        ],
        { cancelable: true },
      );
    } else {
      deleteAccount();
    }
  };

  return (
    <Menu
      trigger={<Elipsis />}
      options={[
        {
          title: "Change Password",
          onClick: () => navigation.navigate("Change Password"),
        },
        {
          title: "Delete Account",
          onClick: handleDeleteWrapper,
          destructive: true,
        },
      ]}
    />
  );
}
