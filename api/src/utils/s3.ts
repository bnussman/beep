import { S3_ACCESS_KEY_ID, S3_ACCESS_KEY_SECRET, S3_ENDPOINT, isLocalS3 } from "./constants";
import { S3Client } from '@capgo/s3-lite-client';

export const s3 = new S3Client({
  endPoint: S3_ENDPOINT,
  secretKey: S3_ACCESS_KEY_SECRET,
  accessKey: S3_ACCESS_KEY_ID,
  port: isLocalS3 ? 9000 : 443,
  region: 'beep',
  useSSL: !isLocalS3,
  bucket: "beep",
  pathStyle: isLocalS3,
});
