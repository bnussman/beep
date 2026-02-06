import { useIsSignedIn } from "@/utils/useUser";
import { Redirect } from "expo-router";

export default function Index()  {
  const authed = useIsSignedIn();

  if (authed) {
    return <Redirect href="/(app)/(drawer)/ride" />;
  }

  return <Redirect href="/login" />;
}