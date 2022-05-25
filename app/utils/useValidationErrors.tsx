import { ApolloError } from "@apollo/client";

export function useValidationErrors<T>(error: ApolloError | undefined) {
  if (error === undefined || !isValidationError(error)) {
    return undefined;
  }

  const errors = error?.graphQLErrors[0]?.extensions as {
    [k in keyof T]: string[];
  };

  return errors;
}

export function isValidationError(error: ApolloError | undefined) {
  if (error === undefined) {
    return false;
  }

  return error.message.startsWith("Validation");
}

export function getPrintableValidationError(error: ApolloError) {
  if (isValidationError(error)) {
    const errors = error?.graphQLErrors[0]?.extensions as Record<
      string,
      string[]
    >[];
    return (
      Object.keys(errors)
        // @ts-expect-error i hate this
        .map((key) => errors[key].join("\n"))
        .join("\n")
    );
  }

  return error.message;
}
