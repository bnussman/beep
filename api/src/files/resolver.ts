import * as Sentry from "@sentry/node";
import AWS from 'aws-sdk';
import express from "express";
import multer from "multer";
import { APIResponse, APIStatus } from "../utils/Error";
import { ProfilePhotoResponse } from "./files";
import { BeepORM } from "../app";

export class FilesController {

    public async uploadFile(request: express.Request): Promise<ProfilePhotoResponse | APIResponse> {
        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET
        });

        await this.handleFile(request);

        let fileName = request.file.originalname;

        const extention = fileName.substr(fileName.lastIndexOf("."), fileName.length);

        fileName = request.user.user._id + "-" + Date.now() + extention;

        const uploadParams = {
            Body: request.file.buffer,
            Key: "images/" + fileName,
            Bucket: "ridebeepapp",
            ACL: "public-read"
        };

        try {
            const result = await s3.upload(uploadParams).promise();

            if (result) {
                //if user had an existing profile picture, use S3 to delete the old photo
                if (request.user.user.photoUrl != null) {
                    const key: string = request.user.user.photoUrl.split("https://ridebeepapp.s3.amazonaws.com/")[1];

                    const params = {
                        Bucket: "ridebeepapp",
                        Key: key
                    };

                    s3.deleteObject(params,  (error: Error, data: unknown) => {
                        if (error) {
                            Sentry.captureException(error);
                        }
                    });
                }

                request.user.user.photoUrl = result.Location;

                console.log(request.user.user.photoUrl);

                await BeepORM.userRepository.persistAndFlush(request.user.user);

                return {
                    status: APIStatus.Success,
                    message: "Successfully set profile photo",
                    url: result.Location
                };
            }
            else {
                Sentry.captureException("No result from AWS");
                return new APIResponse(APIStatus.Error, "Error");
            }
        }
        catch (error) {
            console.error(error);
            Sentry.captureException(error);
            return new APIResponse(APIStatus.Error, error);
        }
    }

    private handleFile(request: express.Request): Promise<void> {
        //console.log(request);
        const multerSingle = multer({limits: { fieldSize: 25 * 1024 * 1024 }}).single("photo") as any;
        return new Promise((resolve, reject): void => {
            multerSingle(request, undefined, async (error: Error) => {
                if (error) {
                    console.error(error);
                    reject(error);
                }
                resolve();
            });
        });
    }
}
