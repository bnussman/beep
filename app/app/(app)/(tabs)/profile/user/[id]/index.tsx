import UserDetailsPage from "@/components/user/UserDetailsPage";
import { useLocalSearchParams } from "expo-router";

export default function User() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <UserDetailsPage id={id} />;
}