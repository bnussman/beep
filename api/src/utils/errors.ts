import { GraphQLError, GraphQLFormattedError } from "graphql";
import { ValidationError as ClassValidatorError } from 'class-validator';

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

export function formatError(formattedError: GraphQLFormattedError, error: GraphQLError) {
  if (error?.message === "Argument Validation Error") {
    const errors = formattedError.extensions!.validationErrors as ClassValidatorError[];

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
