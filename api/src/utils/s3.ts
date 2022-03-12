import { S3 } from "aws-sdk";
import * as Sentry from "@sentry/node";

export async function getAllObjects(s3: S3, params: S3.ListObjectsV2Request): Promise<S3.ObjectList> {
  const { IsTruncated, Contents, NextContinuationToken } = await s3.listObjectsV2(params).promise();

  if (!IsTruncated) {
    return Contents || [];
  }

  const objects = await getAllObjects(s3, { ...params, ContinuationToken: NextContinuationToken });

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


export function getOlderObjectsToDelete(s3: S3, objects: S3.ObjectList) {
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

export async function deleteObject(s3: S3, key: string) {
  try {
    await s3.deleteObject({ Bucket: "beep", Key: key }).promise();
  }
  catch (error) {
    Sentry.captureException(error);
  }
}