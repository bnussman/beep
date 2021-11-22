import { sha256 } from 'js-sha256';
import { getToken, setPushToken, getUserFromEmail, sendResetEmail, deactivateTokens, createVerifyEmailEntryAndSendEmail } from './helpers';
import { wrap } from '@mikro-orm/core';
import { User } from '../entities/User';
import { ForgotPassword } from '../entities/ForgotPassword';
import { Arg, Authorized, Ctx, Field, Mutation, ObjectType, Resolver } from 'type-graphql';
import { LoginInput, ResetPasswordInput, SignUpInput } from '../validators/auth';
import { TokenEntry } from '../entities/TokenEntry';
import { Context } from '../utils/context';
import AWS from 'aws-sdk';
import { lights } from '../utils/lights';
import * as unleash from 'unleash-client';

@ObjectType()
class Auth {
  @Field()
  public user!: User;

  @Field(() => TokenEntry)
  public tokens!: TokenEntry;
}

@Resolver()
export class AuthResolver {

  @Mutation(() => Auth)
  public async login(@Ctx() ctx: Context, @Arg('input') { username, password, pushToken }: LoginInput): Promise<Auth> {
    const user = await ctx.em.findOne(User, { username });

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.password) {
      await ctx.em.populate(user, 'password');
    }

    if (user.password !== sha256(password)) {
      throw new Error("Password is incorrect");
    }

    const tokenData = await getToken(user);

    if (pushToken) {
      setPushToken(user, pushToken);
    }

    return {
      user: user,
      tokens: tokenData
    };
  }

  @Mutation(() => Auth)
  public async signup(@Ctx() ctx: Context, @Arg('input') input: SignUpInput): Promise<Auth> {
    const { createReadStream, filename } = await input.picture;

    const user = new User();

    const s3 = new AWS.S3({
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_ACCESS_KEY_SECRET,
      endpoint: process.env.S3_ENDPOINT_URL
    });

    const extention = filename.substr(filename.lastIndexOf("."), filename.length);

    const uploadParams = {
      Body: createReadStream(),
      Key: "images/" + user.id + "-" + Date.now() + extention,
      Bucket: "beep",
      ACL: "public-read"
    };

    const result = await s3.upload(uploadParams).promise();

    if (!result) {
      throw new Error("No result from AWS");
    }

    input.password = sha256(input.password);

    wrap(user).assign({ ...input, photoUrl: result.Location });

    // @TODO find a better way to handle unique key errors
    try {
      await ctx.em.persistAndFlush(user);
    }
    catch (error: any) {
      if (error.detail) {
        throw new Error(error.detail);
      }
      throw error;
    }

    const tokenData = await getToken(user);

    createVerifyEmailEntryAndSendEmail(user);

    if (unleash.isEnabled('lights')) {
      lights();
    }

    return {
      user: user,
      tokens: tokenData
    };
  }

  @Mutation(() => Boolean)
  @Authorized('No Verification')
  public async logout(@Ctx() ctx: Context, @Arg('isApp', { nullable: true }) isApp?: boolean): Promise<boolean> {
    await ctx.em.removeAndFlush(ctx.token);

    if (isApp) {
      setPushToken(ctx.user, null);
    }

    return true;
  }

  @Mutation(() => Boolean)
  public async removeToken(@Ctx() ctx: Context, @Arg('token') tokenid: string): Promise<boolean> {
    await ctx.em.removeAndFlush({ tokenid: tokenid });

    return true;
  }

  @Mutation(() => Boolean)
  public async forgotPassword(@Ctx() ctx: Context, @Arg('email') email: string): Promise<boolean> {
    const user: User | null = await getUserFromEmail(email);

    if (!user) {
      throw new Error("User does not exist");
    }

    const existing = await ctx.em.findOne(ForgotPassword, { user: user });

    if (existing) {
      sendResetEmail(email, existing.id, user.first);

      throw new Error("You have already requested to reset your password. We have re-sent your email. Check your email and follow the instructions.");
    }

    const entry = new ForgotPassword(user);

    await ctx.em.persistAndFlush(entry);

    sendResetEmail(email, entry.id, user.first);

    return true;
  }

  @Mutation(() => Boolean)
  public async resetPassword(@Ctx() ctx: Context, @Arg('input') input: ResetPasswordInput): Promise<boolean> {
    const entry = await ctx.em.findOne(ForgotPassword, input.id, { populate: ['user'] });

    if (!entry) {
      throw new Error("This reset password request does not exist");
    }

    if ((entry.time.getTime() + (3600 * 1000)) < Date.now()) {
      throw new Error("Your verification token has expired. You must re-request to reset your password.");
    }

    entry.user.password = sha256(input.password);

    deactivateTokens(entry.user);

    ctx.em.remove(entry);

    ctx.em.persist(entry.user);

    await ctx.em.flush();

    return true;
  }
}
