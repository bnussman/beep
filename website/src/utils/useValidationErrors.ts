import { ApolloError } from "@apollo/client";

export function useValidationErrors<T>(error: ApolloError | undefined) {
  if (error === undefined || !isValidationError(error)) {
    return undefined;
  }

  const errors = error?.graphQLErrors[0]?.extensions!.validationErrors;

  const output: { [key: string]: string[] } = {};

  // @ts-expect-error todo
  for (const error of errors) {
    if (!error.constraints) continue;

    const items = Object.values<string>(error.constraints);

    output[error.property] = items;
  }

  console.log(output)

  return output;
}

export function isValidationError(error: ApolloError | undefined) {
  if (error === undefined) {
    return false;
  }

  return error.message.includes("Validation");
}
