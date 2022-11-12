import { GraphQLError, GraphQLFormattedError } from "graphql";

export function formatError(error: GraphQLFormattedError) {
  if (error?.message === "Argument Validation Error") {
    // @ts-expect-error fix types here
    const errors = error?.extensions?.exception?.validationErrors as ValidationError[];

    const output: { [key: string]: string[] } = {};

    for (const error of errors) {
      if (!error.constraints) continue;

      const items = Object.values<string>(error.constraints);

      output[error.property] = items;
    }

    return new GraphQLError("Validation Error", output);
  }

  return error;
}