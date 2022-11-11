import { ApolloError, ValidationError } from "apollo-server-core";

export function formatError(error: ApolloError) {
  if (error?.message === "Argument Validation Error") {
    const errors = error?.extensions?.exception?.validationErrors as ValidationError[];

    const output: { [key: string]: string[] } = {};

    for (const error of errors) {
      if (!error.constraints) continue;

      const items = Object.values<string>(error.constraints);

      output[error.property] = items;
    }

    return new ApolloError("Validation Error", undefined, output);
  }

  return error;
}