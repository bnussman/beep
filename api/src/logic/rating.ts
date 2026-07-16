import { avg, eq } from "drizzle-orm";
import { db } from "../utils/db.ts";
import { rating } from "../../drizzle/schema.ts";

export async function getUsersAverageRating(userId: string) {
  const result = await db
    .select({
      avgRating: avg(rating.stars),
    })
    .from(rating)
    .where(eq(rating.rated_id, userId));
    
  return result[0].avgRating;
}