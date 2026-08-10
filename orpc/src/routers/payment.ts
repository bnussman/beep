import { z } from "zod";
import { authedProcedure, router } from "../utils/trpc";
import { db } from "../utils/db";
import { count } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { DEFAULT_PAGE_SIZE } from "../utils/constants";

export const paymentRouter = router({
  payments: authedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        pageSize: z.number().default(DEFAULT_PAGE_SIZE),
        userId: z.string().optional(),
        active: z.boolean().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const userId = input.userId ?? ctx.user.id;

      if (ctx.user.role === "user" && userId !== ctx.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be an admin to get purchases for other users",
        });
      }

      const where = {
        user_id: input.userId,
        ...(input.active ? { expires: { gte: new Date() } } : {}),
      };

      const [payments, paymentsCount] = await Promise.all([
        db.query.payment.findMany({
          orderBy: { created: "desc" },
          limit: input.pageSize,
          offset: (input.page - 1) * input.pageSize,
          where,
          with: {
            user: {
              columns: {
                id: true,
                first: true,
                last: true,
                photo: true,
              },
            },
          },
        }),
        db.query.payment.findMany({
          columns: {},
          extras: { count: count() },
          where,
        }),
      ]);

      const results = paymentsCount[0].count;

      return {
        payments,
        pages: Math.ceil(results / input.pageSize),
        page: input.page,
        pageSize: input.pageSize,
        results,
      };
    }),
});
