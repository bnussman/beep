import * as Sentry from "@sentry/node";
import { S3 } from "aws-sdk";
import { S3_ACCESS_KEY_ID, S3_ACCESS_KEY_SECRET, S3_ENDPOINT_URL, isLocalS3 } from "./constants";

export const s3 = new S3({
  accessKeyId: S3_ACCESS_KEY_ID,
  secretAccessKey: S3_ACCESS_KEY_SECRET,
  endpoint: S3_ENDPOINT_URL,
  s3ForcePathStyle: isLocalS3,
});

export async function getAllObjects(params: S3.ListObjectsV2Request): Promise<S3.ObjectList> {
  const { IsTruncated, Contents, NextContinuationToken } = await s3.listObjectsV2(params).promise();

  if (!IsTruncated) {
    return Contents || [];
  }

  const objects = await getAllObjects({ ...params, ContinuationToken: NextContinuationToken });

  return objects.concat(Contents || []);
}

export function getUserFromObjectKey(key: string | undefined): string {
  if (!key) {
    throw new Error("S3 Object Key is undefined");
  }

  const withoutPrefix = key.split('/')[1];

  const lastDashIndex = withoutPrefix.lastIndexOf('-');

  return withoutPrefix.substring(0, lastDashIndex);
}

function getTimestampFromKey(key: string | undefined): number {
  if (!key) {
    throw new Error("S3 Object Key is undefined");
  }

  const lastDashIndex = key.lastIndexOf('-');
  const indexOfDot = key.lastIndexOf('.');

  const timestamp = key.substring(lastDashIndex + 1, indexOfDot);

  return Number(timestamp);
}


export function getOlderObjectsToDelete(objects: S3.ObjectList) {
  if (objects.length <= 1) {
    throw new Error("Must have many objects to delete oldest objects");
  }

  let newestObject = objects[0];

  for (const object of objects) {
    if (getTimestampFromKey(newestObject.Key) < getTimestampFromKey(object.Key)) {
      newestObject = object;
    }
  }

  return objects.filter(object => object.Key !== newestObject.Key);
}

export async function deleteObject(key: string) {
  try {
    await s3.deleteObject({ Bucket: "beep", Key: key }).promise();
  }
  catch (error) {
    Sentry.captureException(error);
  }
}