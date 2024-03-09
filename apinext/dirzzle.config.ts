import type { Config } from "drizzle-kit";

export default {
  schema: './drizzle/schema.ts',
  out: "./drizzle",
  driver: 'pg',
  dbCredentials: {
    user: "beep",
    password: "beep",
    host: "localhost",
    database: "beep",
  }
} satisfies Config;