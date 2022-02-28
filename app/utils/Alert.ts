import { ApolloError } from "@apollo/client";
import { Alert as NativeAlert } from "react-native";
import { isMobile } from "./config";

const doAlert = isMobile
  ? NativeAlert.alert
  : (title: string, body: string) => alert(body);

export function Alert(title: string, error: ApolloError) {
  if (error?.message === "Validation Error") {
    const errors = error?.graphQLErrors[0]?.extensions;

    let output = "";

    for (const key of Object.keys(errors)) {
      output += errors[key][0] + "\n";
    }

    doAlert(title, output);
    return;
  }

  doAlert(title, error.message);
}
