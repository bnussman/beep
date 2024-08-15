import { ApolloError } from "@apollo/client";
import { Alert as NativeAlert } from "react-native";
import { isMobile } from "./constants";

const doAlert = isMobile
  ? NativeAlert.alert
  : (title: string, body: string) => alert(body);

export function Alert(error: ApolloError, title = "Error") {
  if (error?.message === "Validation Error") {
    const errors = error?.graphQLErrors[0]?.extensions ?? {};

    const keys = Object.keys(errors);

    const output = keys.map((key) => {
      const validationErrorMessages = errors[key] as string[];
      return validationErrorMessages[0];
    });

    doAlert(title, output.join("\n"));
    return;
  }

  doAlert(title, error.message);
}
