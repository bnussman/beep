import { authedProcedure } from "../../utils/orpc";
import { db } from "../../utils/db";
import { count } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import { condensedUserColumns } from "../users/logic";
import { listPaymentsInputSchema } from "./schemas";
import { getOffsetFromPage, getPagesFromCount } from "../../utils/pagination";

export const paymentRouter = {
  payments: authedProcedure
    .input(listPaymentsInputSchema)
    .handler(async ({ input, context }) => {
      const userId = input.userId ?? context.user.id;

      if (context.user.role === "user" && userId !== context.user.id) {
        throw new ORPCError("UNAUTHORIZED", {
          message: "You must be an admin to get purchases for other users",
        });
      }

      const where = {
        user_id: input.userId,
        ...(input.active ? { expires: { gte: new Date() } } : {}),
      };

      const [payments, paymentsCount] = await Promise.all([
        db.query.payments.findMany({
          orderBy: { created: "desc" },
          limit: input.pageSize,
          offset: getOffsetFromPage(input.page, input.pageSize),
          where,
          with: {
            user: {
              columns: condensedUserColumns,
            },
          },
        }),
        db.query.payments.findMany({
          columns: {},
          extras: { count: count() },
          where,
        }),
      ]);

      const results = paymentsCount[0].count;

      return {
        payments,
        pages: getPagesFromCount(results, input.pageSize),
        page: input.page,
        pageSize: input.pageSize,
        results,
      };
    }),
};
