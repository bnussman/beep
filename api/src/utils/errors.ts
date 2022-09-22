import { ApolloError } from "apollo-server-core";
import { ValidationError } from "class-validator";
import { GraphQLError } from "graphql";

export function formatError(error: GraphQLError) {
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