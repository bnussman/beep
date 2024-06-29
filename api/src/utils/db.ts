import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../../drizzle/schema";
import { DB_DATABASE, DB_PASSWORD, DB_USER } from "./constants";

const queryClient = postgres({
  host: "localhost",
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
});

export const db = drizzle(queryClient, { schema });
