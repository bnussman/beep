import { db } from "../services/db";

export async function getActivePayments(userId: string) {
  return await db.query.payments.findMany({
    where: { user_id: userId, expires: { gte: new Date() } },
  });
}