import { count, eq, or } from "drizzle-orm";
import { report } from "../../drizzle/schema";
import { db } from "../utils/db";
import { adminProcedure, authedProcedure, router } from "../utils/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { DEFAULT_PAGE_SIZE } from "../utils/constants";

export const reportRouter = router({
  reports: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        pageSize: z.number().default(DEFAULT_PAGE_SIZE),
        userId: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const where = input.userId
        ? or(
            eq(report.reported_id, input.userId),
            eq(report.reporter_id, input.userId),
          )
        : undefined;

      const reports = await db.query.report.findMany({
        offset: (input.page - 1) * input.pageSize,
        limit: input.pageSize,
        orderBy: { timestamp: "desc" },
        where: input.userId
          ? {
              OR: [
                { reporter_id: input.userId },
                { reported_id: input.userId },
              ],
            }
          : {},
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
            },
          },
          reporter: {
            columns: {
              id: true,
              first: true,
              last: true,
              photo: true,
            },
          },
          handledBy: {
            columns: {
              id: true,
              first: true,
              last: true,
              photo: true,
            },
          },
        },
      });

      const reportsCount = await db
        .select({ count: count() })
        .from(report)
        .where(where);

      const results = reportsCount[0].count;

      return {
        reports,
        page: input.page,
        pages: Math.ceil(results / input.pageSize),
        pageSize: input.pageSize,
        results,
      };
    }),
  report: adminProcedure.input(z.string()).query(async ({ input }) => {
    const r = await db.query.report.findFirst({
      where: { id: input },
      with: {
        reported: {
          columns: {
            id: true,
            first: true,
            last: true,
            photo: true,
          },
        },
        reporter: {
          columns: {
            id: true,
            first: true,
            last: true,
            photo: true,
          },
        },
        handledBy: {
          columns: {
            id: true,
            first: true,
            last: true,
            photo: true,
          },
        },
      },
    });

    if (!r) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return r;
  }),
  updateReport: adminProcedure
    .input(
      z.object({
        reportId: z.string(),
        data: z.object({
          notes: z.string().nullable().optional(),
          handled: z.boolean().nullable().optional(),
        }),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const values = input.data.handled
        ? { handled: true, handled_by_id: ctx.user.id, notes: input.data.notes }
        : { handled: false, handled_by_id: null, notes: input.data.notes };

      const r = await db
        .update(report)
        .set(values)
        .where(eq(report.id, input.reportId))
        .returning();

      return r[0];
    }),
  deleteReport: adminProcedure.input(z.string()).mutation(async ({ input }) => {
    await db.delete(report).where(eq(report.id, input));
  }),
  createReport: authedProcedure
    .input(
      z.object({
        userId: z.string(),
        reason: z.string(),
        beepId: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const r = await db
        .insert(report)
        .values({
          id: crypto.randomUUID(),
          reason: input.reason,
          timestamp: new Date(),
          reported_id: input.userId,
          reporter_id: ctx.user.id,
        })
        .returning();

      return r[0];
    }),
});
