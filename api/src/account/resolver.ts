import { sha256 } from 'js-sha256';
import { createVerifyEmailEntryAndSendEmail } from "../auth/helpers";
import { isEduEmail, deleteUser, Upload } from './helpers';
import { BeepORM } from '../app';
import { wrap } from '@mikro-orm/core';
import { Arg, Authorized, Ctx, Mutation, PubSub, PubSubEngine, Resolver } from 'type-graphql';
import { Context } from '../utils/context';
import { EditAccountInput } from '../validators/account';
import { User } from '../entities/User';
import { GraphQLUpload } from 'graphql-upload';
import AWS from 'aws-sdk';

@Resolver()
export class AccountResolver {

    @Mutation(() => User)
    @Authorized()
    public async editAccount(@Ctx() ctx: Context, @Arg('input') input: EditAccountInput, @PubSub() pubSub: PubSubEngine): Promise<User> {
        if (!input.venmo && !input.cashapp) throw new Error("Please enter at least one form of payment");

        if (input.venmo && input.venmo.charAt(0) == '@') {
            input.venmo = input.venmo.substr(1, input.venmo.length);
        }

        if (input.cashapp && (input.cashapp.charAt(0) == '@' || input.cashapp.charAt(0) == '$')) {
            input.cashapp = input.cashapp.substr(1, input.cashapp.length);
        }

        const oldEmail = ctx.user.email;

        wrap(ctx.user).assign(input);

        if (oldEmail !== input.email) {
            await BeepORM.verifyEmailRepository.nativeDelete({ user: ctx.user });

            wrap(ctx.user).assign({ isEmailVerified: false, isStudent: false });

            await createVerifyEmailEntryAndSendEmail(ctx.user);
        }
        
        pubSub.publish("User" + ctx.user.id, ctx.user);

        await BeepORM.userRepository.persistAndFlush(ctx.user);

        return ctx.user;
    }

    @Mutation(() => Boolean)
    @Authorized()
    public async changePassword(@Ctx() ctx: Context, @Arg('password') password: string): Promise<boolean> {
        wrap(ctx.user).assign({ password: sha256(password) });

        await BeepORM.userRepository.persistAndFlush(ctx.user);

        return true;
    }

    @Mutation(() => Boolean)
    @Authorized()
    public async updatePushToken(@Ctx() ctx: Context, @Arg('pushToken') pushToken: string): Promise<boolean> {
        wrap(ctx.user).assign({ pushToken: pushToken });

        await BeepORM.userRepository.persistAndFlush(ctx.user);

        return true;
    }

    @Mutation(() => Boolean)
    public async verifyAccount(@Arg('id') id: string, @PubSub() pubSub: PubSubEngine): Promise<boolean> {
        const entry = await BeepORM.verifyEmailRepository.findOne(id, { populate: ['user'] });

        if (!entry) {
            throw new Error("Invalid verify email token");
        }

        if ((entry.time.getTime() + (3600 * 1000)) < Date.now()) {
            await BeepORM.verifyEmailRepository.removeAndFlush(entry);
            throw new Error("Your verification token has expired");
        }

        const usersEmail: string | undefined = entry.user.email;

        if (!usersEmail) {
            await BeepORM.verifyEmailRepository.removeAndFlush(entry);
            throw new Error("Please ensure you have a valid email set in your profile. Visit your app or our website to re-send a varification email.");
        }

        if (entry.email !== usersEmail) {
            await BeepORM.verifyEmailRepository.removeAndFlush(entry);
            throw new Error("You tried to verify an email address that is not the same as your current email.");
        }

        let update;

        if (isEduEmail(entry.email)) {
            update = { isEmailVerified: true, isStudent: true };
        }
        else {
            update = { isEmailVerified: true };
        }

        const user = await BeepORM.userRepository.findOne(entry.user);

        if (!user) throw new Error("You tried to verify an account that does not exist");

        wrap(user).assign(update);

        pubSub.publish("User" + user.id, user);

        await BeepORM.userRepository.persistAndFlush(user);

        await BeepORM.verifyEmailRepository.removeAndFlush(entry);

        return true;
    }

    @Mutation(() => Boolean)
    @Authorized()
    public async resendEmailVarification(@Ctx() ctx: Context): Promise<boolean> {
        await BeepORM.verifyEmailRepository.nativeDelete({ user: ctx.user });

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
    public async addProfilePicture(@Ctx() ctx: Context, @Arg("picture", () => GraphQLUpload) { createReadStream, filename, mimetype }: Upload, @PubSub() pubSub: PubSubEngine): Promise<User> {
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

            await BeepORM.userRepository.persistAndFlush(ctx.user);

            return ctx.user;
        }
        else {
            throw new Error("No result from AWS");
        }
    }
}
