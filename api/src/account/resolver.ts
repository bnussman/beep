import { sha256 } from 'js-sha256';
import { createVerifyEmailEntryAndSendEmail } from "../auth/helpers";
import { isEduEmail, deleteUser } from './helpers';
import { BeepORM } from '../app';
import { wrap } from '@mikro-orm/core';
import { Arg, Authorized, Ctx, Mutation, PubSub, PubSubEngine, Resolver } from 'type-graphql';
import { Context } from '../utils/context';
import { EditAccountInput } from '../validators/account';
import { User } from '../entities/User';
import {GraphQLUpload} from 'graphql-upload';
import { Stream } from "stream";
import AWS from 'aws-sdk';

export interface Upload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Stream;
}

@Resolver()
export class AccountResolver {

    @Mutation(() => User)
    @Authorized()
    public async editAccount(@Ctx() ctx: Context, @Arg('input') input: EditAccountInput, @PubSub() pubSub: PubSubEngine): Promise<User> {
        if (input.venmo && input.venmo.charAt(0) == '@') {
            input.venmo = input.venmo.substr(1, input.venmo.length);
        }

        const oldEmail = ctx.user.email;

        wrap(ctx.user).assign(input);

        await BeepORM.userRepository.persistAndFlush(ctx.user); 

        if (oldEmail !== input.email) {
            await BeepORM.verifyEmailRepository.nativeDelete({ user: ctx.user });

            wrap(ctx.user).assign({ isEmailVerified: false, isStudent: false });

            await BeepORM.userRepository.persistAndFlush(ctx.user); 

            createVerifyEmailEntryAndSendEmail(ctx.user, input.email, input.first);
        }

        pubSub.publish("User" + ctx.user.id, ctx.user);

        return ctx.user;
    }

    @Mutation(() => Boolean)
    @Authorized()
    public async changePassword(@Ctx() ctx: Context, @Arg('password') password: string): Promise<boolean> {
        const encryptedPassword = sha256(password);
        
        wrap(ctx.user).assign({ password: encryptedPassword });

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
        const entry = await BeepORM.verifyEmailRepository.findOne(id, { populate: true });

        if (!entry) {
            throw new Error("Invalid verify email token");
        }

        if ((entry.time + (3600 * 1000)) < Date.now()) {
            await BeepORM.verifyEmailRepository.removeAndFlush(entry);
            throw new Error("Your verification token has expired");
        }

        const usersEmail: string | undefined = entry.user.email;

        if (!usersEmail) {
            await BeepORM.verifyEmailRepository.removeAndFlush(entry);
            throw new Error("Please ensure you have a valid email set in your profile. Visit your app or our website to re-send a varification email.");
        }

        //if the user's current email is not the same as the email they are trying to verify dont prcede with the request
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

        pubSub.publish("User" + user.id, update);

        await BeepORM.userRepository.persistAndFlush(user);

        await BeepORM.verifyEmailRepository.removeAndFlush(entry);

        return true;
    }

    @Mutation(() => Boolean)
    @Authorized()
    public async resendEmailVarification(@Ctx() ctx: Context): Promise<boolean> {
        await BeepORM.verifyEmailRepository.nativeDelete({ user: ctx.user });

        createVerifyEmailEntryAndSendEmail(ctx.user, ctx.user.email, ctx.user.first);

        return true;
    }
    
    @Mutation(() => Boolean)
    @Authorized()
    public async deleteAccount(@Ctx() ctx: Context): Promise<boolean> {
        return await deleteUser(ctx.user);
    }

    @Mutation(() => User)
    @Authorized()
    public async addProfilePicture(@Ctx() ctx: Context, @Arg("picture", () => GraphQLUpload) { createReadStream, filename, mimetype }: Upload): Promise<User> {
        console.log(filename);
        console.log(createReadStream);
        console.log(mimetype);

        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET
        });

        const extention = filename.substr(filename.lastIndexOf("."), filename.length);

        filename = ctx.user.id + "-" + Date.now() + extention;

        const uploadParams = {
            Body: createReadStream(),
            Key: "images/" + filename,
            Bucket: "ridebeepapp",
            ACL: "public-read"
        };

        const result = await s3.upload(uploadParams).promise();

        if (result) {
            if (ctx.user.photoUrl) {
                const key: string = ctx.user.photoUrl.split("https://ridebeepapp.s3.amazonaws.com/")[1];

                const params = {
                    Bucket: "ridebeepapp",
                    Key: key
                };

                s3.deleteObject(params, (error: Error) => {
                    if (error) {
                        console.log(error);
                    }
                });
            }

            ctx.user.photoUrl = result.Location;

            console.log(result);

            await BeepORM.userRepository.persistAndFlush(ctx.user);

            return ctx.user;
        }
        else {
            throw new Error("No result from AWS");
        }
    }
}
