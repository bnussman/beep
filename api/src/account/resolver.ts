import { createVerifyEmailEntryAndSendEmail } from "../auth/helpers";
import { isEduEmail, deleteUser, Upload } from './helpers';
import { wrap } from '@mikro-orm/core';
import { Arg, Authorized, Ctx, Mutation, PubSub, PubSubEngine, Resolver } from 'type-graphql';
import { Context } from '../utils/context';
import { ChangePasswordInput } from '../validators/account';
import { PasswordType, User, UserRole } from '../entities/User';
import { GraphQLUpload } from 'graphql-upload';
import { VerifyEmail } from '../entities/VerifyEmail';
import { deleteObject, s3 } from '../utils/s3';
import { hash } from 'bcrypt';

@Resolver()
export class AccountResolver {
  @Mutation(() => Boolean)
  @Authorized('No Verification')
  public async changePassword(@Ctx() ctx: Context, @Arg('input') input: ChangePasswordInput): Promise<boolean> {
    ctx.user.password = await hash(input.password, 10);
    ctx.user.passwordType = PasswordType.BCRYPT;

    await ctx.em.flush();

    return true;
  }

  @Mutation(() => Boolean)
  public async verifyAccount(@Ctx() ctx: Context, @Arg('id') id: string, @PubSub() pubSub: PubSubEngine): Promise<boolean> {
    const verification = await ctx.em.findOneOrFail(VerifyEmail, id, { populate: ['user'] });

    if ((verification.time.getTime() + (18000 * 1000)) < Date.now()) {
      await ctx.em.removeAndFlush(verification);
      throw new Error("Your verification token has expired");
    }

    if (verification.email !== verification.user.email) {
      await ctx.em.removeAndFlush(verification);
      throw new Error("You tried to verify an email address that is not the same as your current email.");
    }

    const update = isEduEmail(verification.email) ? { isEmailVerified: true, isStudent: true } : { isEmailVerified: true };

    wrap(verification.user).assign(update);

    pubSub.publish("User" + verification.user.id, verification.user);

    await ctx.em.removeAndFlush(verification);

    return true;
  }

  @Mutation(() => Boolean)
  @Authorized('No Verification')
  public async resendEmailVarification(@Ctx() ctx: Context): Promise<boolean> {
    await ctx.em.nativeDelete(VerifyEmail, { user: ctx.user });

    createVerifyEmailEntryAndSendEmail(ctx.user, ctx.em);

    return true;
  }

  @Mutation(() => Boolean)
  @Authorized()
  public async deleteAccount(@Ctx() ctx: Context): Promise<boolean> {
    if (ctx.user.role === UserRole.ADMIN) {
      throw new Error("Admin accounts cannot be deleted.");
    }

    return await deleteUser(ctx.user, ctx.em);
  }

  @Mutation(() => User)
  @Authorized('No Verification')
  public async addProfilePicture(@Ctx() ctx: Context, @Arg("picture", () => GraphQLUpload) { createReadStream, filename }: Upload, @PubSub() pubSub: PubSubEngine): Promise<User> {

    const extention = filename.substring(filename.lastIndexOf("."), filename.length);

    filename = ctx.user.id + "-" + Date.now() + extention;

    const uploadParams = {
      Body: createReadStream(),
      Key: "images/" + filename,
      Bucket: "beep",
      ACL: "public-read"
    };

    const result = await s3.upload(uploadParams).promise();

    if (ctx.user.photo) {
      const key = ctx.user.photo.split("https://beep.us-east-1.linodeobjects.com/")[1];

      deleteObject(key);
    }

    ctx.user.photo = result.Location;

    pubSub.publish("User" + ctx.user.id, ctx.user);

    await ctx.em.flush();

    return ctx.user;
  }
}
