import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { useTRPC } from "@/utils/trpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LOCATION_TRACKING } from "@/utils/location";
import { isMobile } from "@/utils/constants";
import { useRouter } from "expo-router";

export function useProfileMenu() {
  const trpc = useTRPC();
  const router = useRouter();
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

  return [
    {
      title: "Change Password",
      onClick: () => router.navigate("/profile/change-password"),
    },
    {
      title: "Delete Account",
      onClick: handleDeleteWrapper,
      destructive: true,
    },
  ]
}
