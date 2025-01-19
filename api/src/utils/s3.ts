import { S3_ACCESS_KEY_ID, S3_ACCESS_KEY_SECRET, S3_ENDPOINT } from "./constants";
import { S3Client } from 'bun';

export const s3 = new S3Client({
  endpoint: S3_ENDPOINT,
  secretAccessKey: S3_ACCESS_KEY_SECRET,
  accessKeyId: S3_ACCESS_KEY_ID,
  region: 'beep',
  bucket: "beep",
});
