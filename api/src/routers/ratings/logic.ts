import { avg, eq } from "drizzle-orm";
import { db } from "../../utils/db";
import { ratings } from "../../../drizzle/schema";

export async function getUsersAverageRating(userId: string) {
  const result = await db
    .select({
      avgRating: avg(ratings.stars),
    })
    .from(ratings)
    .where(eq(ratings.rated_id, userId));
    
  return result[0].avgRating;
}