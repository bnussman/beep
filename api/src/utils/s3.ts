import {
  S3_ACCESS_KEY_ID,
  S3_ACCESS_KEY_SECRET,
  S3_BUCKET,
  S3_ENDPOINT,
} from "./constants.ts";
import { S3Client } from "@bradenmacdonald/s3-lite-client";

export const s3 = new S3Client({
  endPoint: S3_ENDPOINT,
  secretKey: S3_ACCESS_KEY_SECRET,
  accessKey: S3_ACCESS_KEY_ID,
  bucket: S3_BUCKET,
  region: 'idk',
});
