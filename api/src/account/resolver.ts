import { sha256 } from 'js-sha256';
import { createVerifyEmailEntryAndSendEmail } from "../auth/helpers";
import { isEduEmail, deleteUser, Upload } from './helpers';
import { wrap } from '@mikro-orm/core';
import { Arg, Authorized, Ctx, Mutation, PubSub, PubSubEngine, Resolver } from 'type-graphql';
import { Context } from '../utils/context';
import { EditAccountInput, ChangePasswordInput } from '../validators/account';
import { User } from '../entities/User';
import { GraphQLUpload } from 'graphql-upload';
import AWS from 'aws-sdk';
import { VerifyEmail } from '../entities/VerifyEmail';

@Resolver()
export class AccountResolver {

  @Mutation(() => User)
  @Authorized()
  public async editAccount(@Ctx() ctx: Context, @Arg('input') input: EditAccountInput, @PubSub() pubSub: PubSubEngine): Promise<User> {
    const oldEmail = ctx.user.email;

    wrap(ctx.user).assign(input);

    if (oldEmail !== input.email) {
      await ctx.em.nativeDelete(VerifyEmail, { user: ctx.user });

      wrap(ctx.user).assign({ isEmailVerified: false, isStudent: false });

      await createVerifyEmailEntryAndSendEmail(ctx.user);
    }

    pubSub.publish("User" + ctx.user.id, ctx.user);

    await ctx.em.flush();

    return ctx.user;
  }

  @Mutation(() => Boolean)
  @Authorized()
  public async changePassword(@Ctx() ctx: Context, @Arg('input') input: ChangePasswordInput): Promise<boolean> {
    ctx.user.password = sha256(input.password);

    await ctx.em.flush();

    return true;
  }

  @Mutation(() => Boolean)
  @Authorized()
  public async updatePushToken(@Ctx() ctx: Context, @Arg('pushToken') pushToken: string): Promise<boolean> {
    ctx.user.pushToken = pushToken;

    await ctx.em.flush();

    return true;
  }

  @Mutation(() => Boolean)
  public async verifyAccount(@Ctx() ctx: Context, @Arg('id') id: string, @PubSub() pubSub: PubSubEngine): Promise<boolean> {
    const entry = await ctx.em.findOne(VerifyEmail, id, { populate: ['user'] });

    if (!entry) {
      throw new Error("Invalid verify email token");
    }

    // @TODO clean up this if condition
    if ((entry.time.getTime() + (3600 * 1000)) < Date.now()) {
      await ctx.em.removeAndFlush(entry);
      throw new Error("Your verification token has expired");
    }

    const usersEmail: string | undefined = entry.user.email;

    if (!usersEmail) {
      await ctx.em.removeAndFlush(entry);
      throw new Error("Please ensure you have a valid email set in your profile. Visit your app or our website to re-send a varification email.");
    }

    if (entry.email !== usersEmail) {
      await ctx.em.removeAndFlush(entry);
      throw new Error("You tried to verify an email address that is not the same as your current email.");
    }

    const update = isEduEmail(entry.email) ? { isEmailVerified: true, isStudent: true } : { isEmailVerified: true };

    const user = await ctx.em.findOne(User, entry.user);

    if (!user) throw new Error("You tried to verify an account that does not exist");

    wrap(user).assign(update);

    pubSub.publish("User" + user.id, user);

    await ctx.em.removeAndFlush(entry);

    return true;
  }

  @Mutation(() => Boolean)
  @Authorized()
  public async resendEmailVarification(@Ctx() ctx: Context): Promise<boolean> {
    await ctx.em.nativeDelete(VerifyEmail, { user: ctx.user });

    createVerifyEmailEntryAndSendEmail(ctx.user);

    return true;
  }

  @Mutation(() => Boolean)
  @Authorized()
  public async deleteAccount(@Ctx() ctx: Context): Promise<boolean> {
    return await deleteUser(ctx.user);
  }

  @Mutation(() => User)
  @Authorized()
  public async addProfilePicture(@Ctx() ctx: Context, @Arg("picture", () => GraphQLUpload) { createReadStream, filename }: Upload, @PubSub() pubSub: PubSubEngine): Promise<User> {
    const s3 = new AWS.S3({
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_ACCESS_KEY_SECRET,
      endpoint: process.env.S3_ENDPOINT_URL
    });

    const extention = filename.substr(filename.lastIndexOf("."), filename.length);

    filename = ctx.user.id + "-" + Date.now() + extention;

    const uploadParams = {
      Body: createReadStream(),
      Key: "images/" + filename,
      Bucket: "beep",
      ACL: "public-read"
    };

    const result = await s3.upload(uploadParams).promise();

    if (result) {
      if (ctx.user.photoUrl) {
        const key: string = ctx.user.photoUrl.split("https://beep.us-east-1.linodeobjects.com/")[1];

        const params = {
          Bucket: "beep",
          Key: key
        };

        s3.deleteObject(params, (error: Error) => {
          if (error) {
            console.log(error);
          }
        });
      }

      ctx.user.photoUrl = result.Location;

      pubSub.publish("User" + ctx.user.id, ctx.user);

      await ctx.em.flush();

      return ctx.user;
    }
    else {
      throw new Error("No result from S3");
    }
  }
}
