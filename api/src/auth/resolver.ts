import { sha256 } from 'js-sha256';
import { sendResetEmail, createVerifyEmailEntryAndSendEmail } from './helpers';
import { wrap } from '@mikro-orm/core';
import { User } from '../entities/User';
import { ForgotPassword } from '../entities/ForgotPassword';
import { Arg, Authorized, Ctx, Field, Mutation, ObjectType, Resolver } from 'type-graphql';
import { LoginInput, ResetPasswordInput, SignUpInput } from '../validators/auth';
import { TokenEntry } from '../entities/TokenEntry';
import { Context } from '../utils/context';
import { s3 } from '../utils/s3';
import { FileUpload } from 'graphql-upload';
import { Password, PasswordType } from '../entities/Password';
import { compare, hash } from 'bcrypt';
import { AuthenticationError } from 'apollo-server-core';

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
    const user = await ctx.em.findOneOrFail(User, { $or: [ { username }, { email: username } ] }, { populate: ['password'] });

    // @TODO: clean this up. probably use switch or something
    if (user.password.type === PasswordType.SHA256) {
      const isPasswordCorrect = sha256(password) === user.password.password;

      if (!isPasswordCorrect) {
        throw new AuthenticationError("Password is incorrect");
      }
    }
    else if (user.password.type === PasswordType.BCRYPT) {
      const isPasswordCorrect = await compare(password, user.password.password);

      if (!isPasswordCorrect) {
        throw new AuthenticationError("Password is incorrect");
      }
    }
    else {
      throw new Error("Unknown password type.");
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
    const { createReadStream, filename } = await (input.picture as unknown as Promise<FileUpload>);

    const user = new User();

    const extention = filename.substring(filename.lastIndexOf("."), filename.length);

    const uploadParams = {
      Body: createReadStream(),
      Key: `images/${user.id}-${Date.now()}${extention}`,
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
      password: new Password({
        type: PasswordType.BCRYPT,
        password: await hash(input.password, 10),
        user 
      })
    }, { em: ctx.em });

    const tokens = new TokenEntry(user);

    // How do I make this not so ugly @Mikro-ORM
    try {
      await ctx.em.persistAndFlush([user, tokens]);
    } catch (error: any) {
      const msg = error.message as string;
      if (msg.includes("unique constraint")) {
        throw new Error("That username or email is taken");
      }
      throw error;
    }

    createVerifyEmailEntryAndSendEmail(user, ctx.em);

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

    const existing = await ctx.em.findOne(ForgotPassword, { user });

    if (existing) {
      if ((existing.time.getTime() + (18000 * 1000)) < Date.now()) {
        ctx.em.remove(existing);
      }
      else {
        sendResetEmail(email, existing.id, user.username);

        throw new Error("You have already requested to reset your password. We have re-sent your email. Check your email and follow the instructions.");
      }
    }

    const entry = new ForgotPassword(user);

    await ctx.em.persistAndFlush(entry);

    sendResetEmail(email, entry.id, user.username);

    return true;
  }

  @Mutation(() => Boolean)
  public async resetPassword(@Ctx() ctx: Context, @Arg('id') id: string, @Arg('input') input: ResetPasswordInput): Promise<boolean> {
    const entry = await ctx.em.findOne(ForgotPassword, id, { populate: ['user'] });

    if (!entry) {
      throw new Error("This reset password request does not exist");
    }

    if ((entry.time.getTime() + (18000 * 1000)) < Date.now()) {
      throw new Error("Your reset token has expired. You must re-request to reset your password.");
    }

    entry.user.password = new Password({
      user: ctx.user,
      type: PasswordType.BCRYPT,
      password: input.password
    });

    await ctx.em.nativeDelete(TokenEntry, { user: entry.user });

    ctx.em.remove(entry);

    await ctx.em.persistAndFlush(entry.user);

    return true;
  }
}
