import { count } from "drizzle-orm";
import { feedback } from "../../../drizzle/schema";
import { db } from "../../utils/db";

export async function getFeedbacksCount() {
 const data  = await db.select({ count: count() }).from(feedback);

 return data[0].count;
}