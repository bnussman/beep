import { GraphQLError, GraphQLFormattedError } from "graphql";
import { unwrapResolverError } from '@apollo/server/errors';

export class ValidationError extends GraphQLError {
  public constructor(validationErrors: any) {
    super('Validation Error', {
      extensions: {
        // code: 'BAD_USER_INPUT',
        ...validationErrors
      }
    });

    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export function formatError(formattedError: GraphQLFormattedError, error: any) {
  const originalError = unwrapResolverError(error);

  // if (originalError instanceof ArgumentValidationError) {
  //   console.log("hey")
  // }

  if (error?.message === "Argument Validation Error") {
    // @ts-expect-error fix types here
    const errors = originalError.validationErrors;

    console.log(originalError)
    const output: { [key: string]: string[] } = {};

    for (const error of errors) {
      if (!error.constraints) continue;

      const items = Object.values<string>(error.constraints);

      output[error.property] = items;
    }

    return new ValidationError(output);
  }

  return formattedError;
}