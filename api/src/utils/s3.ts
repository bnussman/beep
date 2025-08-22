import {
  S3_ACCESS_KEY_ID,
  S3_ACCESS_KEY_SECRET,
  S3_BUCKET,
  S3_ENDPOINT,
} from "./constants";
import { S3Client } from "bun";
// test
export const s3 = new S3Client({
  endpoint: S3_ENDPOINT,
  secretAccessKey: S3_ACCESS_KEY_SECRET,
  accessKeyId: S3_ACCESS_KEY_ID,
  bucket: S3_BUCKET,
});
