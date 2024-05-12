import { GraphQLScalarType } from "graphql";

export const FileScaler = new GraphQLScalarType({
  name: "File",
  description: "Mongo object id scalar type",
  serialize(value: unknown): string {
    throw new Error("File scaler not fully implemented");
  },
  parseValue(value: unknown): File {
    return value as File;
  },
  parseLiteral(ast) {
    throw new Error("File scaler not fully implemented");
  },
});
