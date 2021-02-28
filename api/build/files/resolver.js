"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesController = void 0;
const Sentry = __importStar(require("@sentry/node"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const multer_1 = __importDefault(require("multer"));
const Error_1 = require("../utils/Error");
const app_1 = require("../app");
class FilesController {
    async uploadFile(request) {
        const s3 = new aws_sdk_1.default.S3({
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
                    const key = request.user.user.photoUrl.split("https://ridebeepapp.s3.amazonaws.com/")[1];
                    const params = {
                        Bucket: "ridebeepapp",
                        Key: key
                    };
                    s3.deleteObject(params, (error, data) => {
                        if (error) {
                            Sentry.captureException(error);
                        }
                    });
                }
                request.user.user.photoUrl = result.Location;
                console.log(request.user.user.photoUrl);
                await app_1.BeepORM.userRepository.persistAndFlush(request.user.user);
                return {
                    status: Error_1.APIStatus.Success,
                    message: "Successfully set profile photo",
                    url: result.Location
                };
            }
            else {
                Sentry.captureException("No result from AWS");
                return new Error_1.APIResponse(Error_1.APIStatus.Error, "Error");
            }
        }
        catch (error) {
            console.error(error);
            Sentry.captureException(error);
            return new Error_1.APIResponse(Error_1.APIStatus.Error, error);
        }
    }
    handleFile(request) {
        //console.log(request);
        const multerSingle = multer_1.default({ limits: { fieldSize: 25 * 1024 * 1024 } }).single("photo");
        return new Promise((resolve, reject) => {
            multerSingle(request, undefined, async (error) => {
                if (error) {
                    console.error(error);
                    reject(error);
                }
                resolve();
            });
        });
    }
}
exports.FilesController = FilesController;
