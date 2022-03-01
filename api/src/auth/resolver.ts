import { sha256 } from 'js-sha256';
import { sendResetEmail, createVerifyEmailEntryAndSendEmail } from './helpers';
import { Entity, wrap } from '@mikro-orm/core';
import { User } from '../entities/User';
import { ForgotPassword } from '../entities/ForgotPassword';
import { Arg, Authorized, Ctx, Field, Mutation, ObjectType, Resolver } from 'type-graphql';
import { LoginInput, ResetPasswordInput, SignUpInput } from '../validators/auth';
import { TokenEntry } from '../entities/TokenEntry';
import { Context } from '../utils/context';
import { lights } from '../utils/lights';
import AWS from 'aws-sdk';
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
    const user = await ctx.em.findOne(User, { $or: [ { username, password: sha256(password) }, { email: username, password: sha256(password) } ] });

    if (!user) {
      throw new Error("Username, email, or password is incorrect.");
    }

    const tokens = new TokenEntry(user);

    if (pushToken) {
      user.pushToken = pushToken;
    }

    ctx.em.persistAndFlush([user, tokens]);

    return { user, tokens };
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

    wrap(user).assign({
      ...input,
      photoUrl: result.Location,
      password: sha256(input.password)
    });

    const tokens = new TokenEntry(user);

    await ctx.em.persistAndFlush([user, tokens]);

    createVerifyEmailEntryAndSendEmail(user, ctx.em);

    if (unleash.isEnabled('lights')) {
      lights();
    }

    return { user, tokens };
  }

  @Mutation(() => Boolean)
  @Authorized('No Verification')
  public async logout(@Ctx() ctx: Context, @Arg('isApp', { nullable: true }) isApp?: boolean): Promise<boolean> {
    await ctx.em.removeAndFlush(ctx.token);

    if (isApp) {
      wrap(ctx.user).assign({
        pushToken: null
      });
      await ctx.em.persistAndFlush(ctx.user);
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
    const user = await ctx.em.findOne(User, { email }); 

    if (!user) {
      throw new Error("User does not exist");
    }

    const existing = await ctx.em.findOne(ForgotPassword, { user: user });

    if (existing) {
      sendResetEmail(email, existing.id, user.username);

      throw new Error("You have already requested to reset your password. We have re-sent your email. Check your email and follow the instructions.");
    }

    const entry = new ForgotPassword(user);

    await ctx.em.persistAndFlush(entry);

    sendResetEmail(email, entry.id, user.username);

    return true;
  }

  @Mutation(() => Boolean)
  public async resetPassword(@Ctx() ctx: Context, @Arg('input') input: ResetPasswordInput): Promise<boolean> {
    const entry = await ctx.em.findOne(ForgotPassword, input.id, { populate: ['user'] });

    if (!entry) {
      throw new Error("This reset password request does not exist");
    }

    if ((entry.time.getTime() + (18000 * 1000)) < Date.now()) {
      throw new Error("Your reset token has expired. You must re-request to reset your password.");
    }

    entry.user.password = sha256(input.password);

    await ctx.em.nativeDelete(TokenEntry, { user: entry.user });

    ctx.em.remove(entry);

    await ctx.em.persistAndFlush(entry.user);

    return true;
  }
}
