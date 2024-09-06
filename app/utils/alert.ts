import { Alert as NativeAlert } from "react-native";
import { isMobile } from "./constants";
import { TRPCClientError } from "@trpc/client";

const doAlert = isMobile
  ? NativeAlert.alert
  : (title: string, body: string) => alert(body);

export function Alert(error: TRPCClientError<any>, title = "Error") {
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
