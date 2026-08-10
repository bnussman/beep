import { db } from "../utils/db";

export async function getActivePayments(userId: string) {
  return await db.query.payment.findMany({
    where: { user_id: userId, expires: { gte: new Date() } },
  });
}