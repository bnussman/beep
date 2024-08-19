import { count, desc } from "drizzle-orm";
import { report } from "../../drizzle/schema";
import { db } from "../utils/db";
import { adminProcedure, router } from "../utils/trpc";
import { z } from "zod";

export const reportRouter = router({
  reports: adminProcedure
    .input(
      z.object({
        offset: z.number(),
        show: z.number(),
      })
    )
    .query(async ({ input }) => {
      const reports = await db.query.report.findMany({
        offset: input.offset,
        limit: input.show,
        columns: {
          reported_id: false,
          reporter_id: false,
        },
        with: {
          reported: {
            columns: {
              id: true,
              first: true,
              last: true,
              photo: true,
            }
          },
          reporter: {
            columns: {
              id: true,
              first: true,
              last: true,
              photo: true,
            }
          },
        },
      });

      const reportsCount = await db
        .select({ count: count() })
        .from(report);

      return {
        reports,
        count: reportsCount[0].count
      }
    })
});
