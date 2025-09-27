export const DB_HOST = process.env.DB_HOST || "localhost";

export const DB_DATABASE = process.env.DB_DATABASE || "beep";

export const DB_PASSWORD = process.env.DB_PASSWORD || "beep";

export const DB_USER = process.env.DB_USER || "beep";

export const DB_URL = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:5432/${DB_DATABASE}`;

export const REDIS_HOST = process.env.REDIS_HOST || "localhost";

export const REDIS_PASSWROD = process.env.REDIS_PASSWORD;

export const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID ?? "beep";

export const S3_ACCESS_KEY_SECRET =
  process.env.S3_ACCESS_KEY_SECRET ?? "beepbeepbeep";

export const S3_ENDPOINT = process.env.S3_ENDPOINT ?? "http://localhost:9000";

export const isLocalS3 = S3_ACCESS_KEY_SECRET === "beepbeepbeep";

/**
 * The user-facing root URL of the S3 bucket.
 * Should start with something like `https://` and end with a `/`
 */
export const S3_BUCKET_URL =
  process.env.S3_BUCKET_URL ?? "http://localhost:9000/beep/";

export const S3_BUCKET = process.env.S3_BUCKET ?? "beep";

export const MAIL_HOST = process.env.MAIL_HOST;

export const MAIL_PORT = process.env.MAIL_PORT;

export const MAIL_USER = process.env.MAIL_USER;

export const MAIL_PASSWORD = process.env.MAIL_PASSWORD;

export const REVENUE_CAT_WEBHOOK_TOKEN = process.env.REVENUE_CAT_WEBHOOK_TOKEN;

export const REVENUE_CAT_SECRET = process.env.REVENUE_CAT_SECRET;

export const SENTRY_DSN = process.env.SENTRY_DSN;

/**
 * A name for the environment.
 *
 * This is used for identifying the environment in Sentry
 */
export const ENVIRONMENT: "dev" | "production" =
  (process.env.ENVIRONMENT_NAME as "dev" | "production") ?? "local";

export const isDevelopment =
  ENVIRONMENT !== "production" &&
  ENVIRONMENT !== "dev" &&
  DB_PASSWORD === "beep";

/**
 * The base URL of the Beep App website.
 *
 * Should start with `http://` or `https://` and should not end with a `/`
 *
 * @example https://ridebeep.app
 * @example https://dev.ridebeep.app
 * @example http://localhost:5173
 */
export const WEB_BASE_URL = process.env.WEB_BASE_URL ?? "http://localhost:5173";

export const DEFAULT_PAGE_SIZE = 25;

export const DEFAULT_LOCATION_RADIUS = 20;

export const CAR_COLOR_OPTIONS = [
  "red",
  "green",
  "blue",
  "purple",
  "black",
  "gray",
  "pink",
  "white",
  "orange",
  "tan",
  "brown",
  "silver",
  "yellow",
];
