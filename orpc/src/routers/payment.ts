import { z } from "zod";
import { authedProcedure } from "../utils/trpc";
import { db } from "../utils/db";
import { count } from "drizzle-orm";
import { DEFAULT_PAGE_SIZE } from "../utils/constants";
import { ORPCError } from "@orpc/server";

export const paymentRouter = {
  payments: authedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        pageSize: z.number().default(DEFAULT_PAGE_SIZE),
        userId: z.string().optional(),
        active: z.boolean().optional(),
      }),
    )
    .handler(async ({ input, context }) => {
      if (context.user.role === "user" && input.userId !== context.user.id) {
        throw new ORPCError("FORBIDDEN", {
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
        pageSize: input.page,
        results,
      };
    }),
  activePayments: authedProcedure.handler(async ({ context }) => {
    return await db.query.payment.findMany({
      where: { user_id: context.user.id, expires: { gte: new Date() } },
    });
  }),
};
