import { sha256 } from 'js-sha256';
import { getToken, setPushToken, getUserFromEmail, sendResetEmail, deactivateTokens, createVerifyEmailEntryAndSendEmail, doesUserExist } from './helpers';
import { wrap } from '@mikro-orm/core';
import { BeepORM } from '../app';
import { User } from '../entities/User';
import { ForgotPassword } from '../entities/ForgotPassword';
import { Arg, Authorized, Ctx, Field, Mutation, ObjectType, Resolver } from 'type-graphql';
import { LoginInput, SignUpInput } from '../validators/auth';
import { TokenEntry } from '../entities/TokenEntry';
import { Context } from '../utils/context';
import {GraphQLUpload} from 'graphql-upload';
import { Upload } from '../account/resolver';
import AWS from 'aws-sdk';

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
    public async login(@Arg('input') input: LoginInput): Promise<Auth> {
        const user = await BeepORM.userRepository.findOne({ username: input.username });

        if (!user) {
            throw new Error("User not found");
        }

        if (!user.password) {
            await BeepORM.userRepository.populate(user, 'password');
        }

        if (user.password != sha256(input.password)) {
            throw new Error("Password is incorrect");
        }

        const tokenData = await getToken(user);

        if (input.pushToken) {
            setPushToken(user, input.pushToken);
        }

        return {
            user: user,
            tokens: tokenData
        };
    }

    @Mutation(() => Auth)
    public async signup(@Arg('input') input: SignUpInput): Promise<Auth> {
        console.log(input);
        if (!input.venmo && !input.cashapp) throw new Error("Please enter at least one form of payment");

        if (input.venmo?.charAt(0) == '@') {
            input.venmo = input.venmo.substr(1, input.venmo.length);
        }

        if (input.cashapp?.charAt(0) == '@' || input.cashapp?.charAt(0) == '$') {
            input.cashapp = input.cashapp.substr(1, input.cashapp.length);
        }
        
        let { createReadStream, filename, mimetype } = await input.picture;

        const user = new User();

        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET
        });

        const extention = filename.substr(filename.lastIndexOf("."), filename.length);

        filename = user.id + "-" + Date.now() + extention;

        const uploadParams = {
            Body: createReadStream(),
            Key: "images/" + filename,
            Bucket: "ridebeepapp",
            ACL: "public-read"
        };

        const result = await s3.upload(uploadParams).promise();

        if (!result) {
            throw new Error("No result from AWS");
        }
    
        input.password = sha256(input.password);

        wrap(user).assign({ ...input, photoUrl: result.Location });

        await BeepORM.userRepository.persistAndFlush(user);
    
        const tokenData = await getToken(user);

        createVerifyEmailEntryAndSendEmail(user);

        return {
            user: user,
            tokens: tokenData
        };
    }
    
    @Mutation(() => Boolean)
    @Authorized()
    public async logout(@Ctx() ctx: Context, @Arg('isApp', { nullable: true }) isApp?: boolean): Promise<boolean> {
        await BeepORM.tokenRepository.removeAndFlush(ctx.token);

        if (isApp) {
            setPushToken(ctx.user, null);
        }

        return true;
    }

    @Mutation(() => Boolean)
    public async removeToken(@Arg('token') tokenid: string): Promise<boolean> {
        await BeepORM.tokenRepository.removeAndFlush({ tokenid: tokenid });

        return true;
    }

    @Mutation(() => Boolean)
    public async forgotPassword(@Arg('email') email: string): Promise<boolean> {

        const user: User | null = await getUserFromEmail(email);

        if (!user) {
            throw new Error("User does not exist");
        }

        const existing = await BeepORM.forgotPasswordRepository.findOne({ user: user });

        if (existing) {
            sendResetEmail(email, existing.id, user.first);

            throw new Error("You have already requested to reset your password. We have re-sent your email. Check your email and follow the instructions.");
        }

        const entry = new ForgotPassword(user);

        await BeepORM.forgotPasswordRepository.persistAndFlush(entry);

        sendResetEmail(email, entry.id, user.first);

        return true;
    }

    @Mutation(() => Boolean)
    public async resetPassword(@Arg('id') id: string, @Arg('password') password: string): Promise<boolean> {
        const entry = await BeepORM.forgotPasswordRepository.findOne(id, { populate: ['user'] });

        if (!entry) {
            throw new Error("This reset password request does not exist");
        }

        if ((entry.time.getTime() + (3600 * 1000)) < Date.now()) {
            throw new Error("Your verification token has expired. You must re-request to reset your password.");
        }

        entry.user.password = sha256(password);

        deactivateTokens(entry.user);

        await BeepORM.forgotPasswordRepository.removeAndFlush(entry);

        await BeepORM.userRepository.persistAndFlush(entry.user);

        return true;
    }
}
