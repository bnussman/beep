import { sha256 } from "js-sha256";
import { sendResetEmail, createVerifyEmailEntryAndSendEmail } from "./helpers";
import { wrap } from "@mikro-orm/core";
import { PasswordType, User } from "../entities/User";
import { ForgotPassword } from "../entities/ForgotPassword";
import {
  Arg,
  Authorized,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Resolver,
} from "type-graphql";
import { LoginInput, ResetPasswordInput, SignUpInput } from "./args";
import { Token } from "../entities/Token";
import { Context } from "../utils/context";
import { s3 } from "../utils/s3";
import { password as bunPassword } from "bun";
import { S3_BUCKET_URL, isDevelopment } from "../utils/constants";
import { GraphQLError } from "graphql";

@ObjectType()
class Auth {
  @Field()
  public user!: User;

  @Field(() => Token)
  public tokens!: Token;
}

@Resolver()
export class AuthResolver {
  @Mutation(() => Auth)
  public async login(
    @Ctx() ctx: Context,
    @Arg("input") { username, password, pushToken }: LoginInput,
  ): Promise<Auth> {
    const user = await ctx.em.findOne(
      User,
      { $or: [{ username }, { email: username }] },
      { populate: ["password", "passwordType"] },
    );

    if (!user) {
      throw new GraphQLError("User not found or credentials incorrect.");
    }

    let isPasswordCorrect = false;

    switch (user.passwordType) {
      case PasswordType.SHA256:
        isPasswordCorrect = sha256(password) === user.password;
        break;
      case PasswordType.BCRYPT:
        isPasswordCorrect = await bunPassword.verify(
          password,
          user.password,
          "bcrypt",
        );
        break;
      default:
        throw new Error(`Unknown password type ${user.passwordType}`);
    }

    if (!isPasswordCorrect) {
      throw new GraphQLError("User not found or credentials incorrect.");
    }

    const tokens = new Token(user);

    if (pushToken) {
      user.pushToken = pushToken;
    }

    ctx.em.persistAndFlush([user, tokens]);

    return { user, tokens };
  }

  @Mutation(() => Auth)
  public async signup(
    @Ctx() ctx: Context,
    @Arg("input") input: SignUpInput,
  ): Promise<Auth> {
    const picture = input.picture;

    if (!picture) {
      throw new GraphQLError("You must upload a profile photo to sign up");
    }

    const user = new User();

    const extention = picture.name.substring(
      picture.name.lastIndexOf("."),
      picture.name.length,
    );

    const objectKey = `images/${user.id}-${Date.now()}${extention}`;

    await s3.putObject(objectKey, picture.stream(), {
      metadata: { "x-amz-acl": "public-read" },
    });

    const password = await bunPassword.hash(input.password, "bcrypt");

    wrap(user).assign({
      username: input.username,
      first: input.first,
      last: input.last,
      phone: input.phone,
      email: input.email,
      venmo: input.venmo,
      cashapp: input.cashapp,
      pushToken: input.pushToken,
      photo: S3_BUCKET_URL + objectKey,
      password,
      passwordType: PasswordType.BCRYPT,
    });

    if (isDevelopment) {
      wrap(user).assign({
        isEmailVerified: true,
        isStudent: true,
      });
    }

    const tokens = new Token(user);

    // How do I make this not so ugly @Mikro-ORM
    try {
      await ctx.em.persistAndFlush([user, tokens]);
    } catch (error: any) {
      const msg = error.message as string;
      if (msg.includes("unique constraint")) {
        throw new GraphQLError("That username or email is taken");
      }
      throw error;
    }

    if (!isDevelopment) {
      createVerifyEmailEntryAndSendEmail(user, ctx.em);
    }

    return { user, tokens };
  }

  @Mutation(() => Boolean)
  @Authorized("No Verification")
  public async logout(
    @Ctx() ctx: Context,
    @Arg("isApp", { nullable: true }) isApp?: boolean,
  ): Promise<boolean> {
    ctx.em.remove(ctx.token);

    if (isApp) {
      ctx.user.pushToken = null;
    }

    ctx.em.persist(ctx.user);

    await ctx.em.flush();

    return true;
  }

  @Mutation(() => Boolean)
  public async removeToken(
    @Ctx() ctx: Context,
    @Arg("token") tokenid: string,
  ): Promise<boolean> {
    await ctx.em.removeAndFlush({ tokenid: tokenid });

    return true;
  }

  @Mutation(() => Boolean)
  public async forgotPassword(
    @Ctx() ctx: Context,
    @Arg("email") email: string,
  ): Promise<boolean> {
    const user = await ctx.em.findOne(User, { email });

    if (!user) {
      throw new GraphQLError("User does not exist");
    }

    const existing = await ctx.em.findOne(ForgotPassword, { user });

    if (existing) {
      if (existing.time.getTime() + 18000 * 1000 < Date.now()) {
        ctx.em.remove(existing);
      } else {
        sendResetEmail(email, existing.id, user.username);

        throw new GraphQLError(
          "You have already requested to reset your password. We have re-sent your email. Check your email and follow the instructions.",
        );
      }
    }

    const entry = new ForgotPassword(user);

    await ctx.em.persistAndFlush(entry);

    sendResetEmail(email, entry.id, user.username);

    return true;
  }

  @Mutation(() => Boolean)
  public async resetPassword(
    @Ctx() ctx: Context,
    @Arg("id") id: string,
    @Arg("input") input: ResetPasswordInput,
  ): Promise<boolean> {
    const entry = await ctx.em.findOne(ForgotPassword, id, {
      populate: ["user"],
    });

    if (!entry) {
      throw new GraphQLError("This reset password request does not exist");
    }

    if (entry.time.getTime() + 18000 * 1000 < Date.now()) {
      throw new GraphQLError(
        "Your reset token has expired. You must re-request to reset your password.",
      );
    }

    entry.user.password = await bunPassword.hash(input.password, "bcrypt");
    entry.user.passwordType = PasswordType.BCRYPT;

    await ctx.em.nativeDelete(Token, { user: entry.user });

    ctx.em.remove(entry);

    await ctx.em.persistAndFlush(entry.user);

    return true;
  }
}
