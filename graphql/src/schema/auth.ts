import { eq, sql } from "drizzle-orm";
import { builder } from "../builder";
import { db } from "../utils/db";
import { password as bunPassword } from "bun";
import { token, user } from "../../drizzle/schema";
import { UserRef } from "./user";
import { GraphQLError } from "graphql";

const tokenRef = builder.drizzleObject("token", {
  name: "Token",
  fields: (t) => ({
    id: t.exposeString("id"),
  }),
});

type AuthPayload = {
  user: typeof user.$inferSelect;
  tokens: typeof token.$inferInsert;
};

// Top-level object that contains user + tokens
const AuthPayloadRef = builder.objectRef<AuthPayload>("AuthPayload").implement({
  fields: (t) => ({
    // either expose the property directly (convenient when the parent object has the same shape)
    user: t.field({
      type: UserRef,
      resolve: (parent) => parent.user,
    }),
    tokens: t.field({
      type: tokenRef,
      resolve: (parent) => parent.tokens,
    }),
  }),
});

builder.mutationType({
  fields: (t) => ({
    login: t.field({
      type: AuthPayloadRef,
      args: {
        username: t.arg.string({ required: true }),
        password: t.arg.string({ required: true }),
        pushToken: t.arg.string(),
      },
      resolve: async (query, args, ctx) => {
        const { username, password, pushToken } = args;

        const u = await db.query.user.findFirst({
          where: {
            OR: [
              { username },
              {
                RAW: (table) =>
                  sql`lower(${table.email}) = ${username.toLowerCase()}`,
              },
            ],
          },
        });

        if (!u) {
          throw new GraphQLError(
            "User does not exist or credentials are incorrect.",
          );
        }

        let isPasswordCorrect = false;

        switch (u.passwordType) {
          case "sha256":
            const hasher = new Bun.CryptoHasher("sha256");
            hasher.update(password);

            isPasswordCorrect = hasher.digest("hex") === u.password;
            break;
          case "bcrypt":
            isPasswordCorrect = await bunPassword.verify(
              password,
              u.password,
              "bcrypt",
            );
            break;
          default:
            throw new GraphQLError(`Unknown password type ${u.passwordType}`);
        }

        if (!isPasswordCorrect) {
          throw new GraphQLError(
            "User does not exist or credentials are incorrect.",
          );
        }

        const tokens = {
          id: crypto.randomUUID(),
          tokenid: crypto.randomUUID(),
          user_id: u.id,
        };

        await db.insert(token).values(tokens);

        if (pushToken) {
          await db
            .update(user)
            .set({ pushToken: pushToken })
            .where(eq(user.id, u.id));
          u.pushToken = pushToken;
        }

        return { user: u, tokens };
      },
    }),
  }),
});
