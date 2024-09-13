import { z } from "zod";
import { adminProcedure, authedProcedure, router } from "../utils/trpc";
import { db } from "../utils/db";
import { and, count, desc, eq, gte } from "drizzle-orm";
import { payment } from "../../drizzle/schema";

export const paymentRouter = router({
  payments: authedProcedure
    .input(
      z.object({
        offset: z.number(),
        limit: z.number(),
        userId: z.string().optional(),
        active: z.boolean().optional()
      })
    )
    .query(async ({ input }) => {
      const where = and(
        input.userId ? eq(payment.user_id, input.userId) : undefined,
        input.active ? gte(payment.expires, new Date()) : undefined,
      );

      const payments = await db.query.payment.findMany({
        orderBy: desc(payment.created),
        limit: input.limit,
        offset: input.offset,
        where,
        with: {
          user: {
            columns: {
              id: true,
              first: true,
              last: true,
              photo: true,
            },
          }
        }
      });

      const paymentsCount = await db
        .select({ count: count() })
        .from(payment)
        .where(where);

      return {
        payments,
        count: paymentsCount[0].count,
      };
    })
});
