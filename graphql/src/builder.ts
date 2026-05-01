import SchemaBuilder from "@pothos/core";
import DrizzlePlugin from "@pothos/plugin-drizzle";
import ScopeAuthPlugin from "@pothos/plugin-scope-auth";
import { db } from "./utils/db";
import { relations } from "../drizzle/relations";
import { getTableConfig } from "drizzle-orm/pg-core";
import { Context } from "./utils/trpc";

type DrizzleRelations = typeof relations;

export interface PothosTypes {
  DrizzleRelations: DrizzleRelations;
  Context: Context;
  AuthScopes: {
    loggedIn: boolean;
    admin: boolean;
  };
  Scalars: { File: { Input: File; Output: never } };
}

export const builder = new SchemaBuilder<PothosTypes>({
  plugins: [DrizzlePlugin, ScopeAuthPlugin],
  drizzle: {
    client: db,
    getTableConfig,
    relations,
  },
  scopeAuth: {
    authorizeOnSubscribe: true,
    authScopes: async (context) => ({
      loggedIn: !!context.user,
      admin: context.user?.role === "admin",
    }),
  },
});

builder.queryType();
builder.mutationType();
builder.scalarType("File", {
  serialize: () => {
    throw new Error("Uploads can only be used as input types");
  },
});
