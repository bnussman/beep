import { count } from "drizzle-orm";
import { feedbacks } from "../../../drizzle/schema";
import { db } from "../../utils/db";

export async function getFeedbacksCount() {
 const data  = await db.select({ count: count() }).from(feedbacks);

 return data[0].count;
}