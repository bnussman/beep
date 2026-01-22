import { count, eq } from "drizzle-orm";
import { report } from "../../drizzle/schema";
import { db } from "../utils/db";
import { adminProcedure, authedProcedure } from "../utils/trpc";
import { z } from "zod";
import { DEFAULT_PAGE_SIZE } from "../utils/constants";
import { ORPCError } from "@orpc/server";

export const reportRouter = {
  reports: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        pageSize: z.number().default(DEFAULT_PAGE_SIZE),
        userId: z.string().optional(),
      }),
    )
    .handler(async ({ input }) => {
      const where = input.userId
        ? {
            OR: [{ reporter_id: input.userId }, { reported_id: input.userId }],
          }
        : {};

      const [reports, reportsCount] = await Promise.all([
        db.query.report.findMany({
          offset: (input.page - 1) * input.pageSize,
          limit: input.pageSize,
          orderBy: { timestamp: "desc" },
          where,
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
        }),
        db.query.report.findMany({
          extras: { count: count() },
          columns: {},
          where,
        }),
      ]);

      const results = reportsCount[0].count;

      return {
        reports,
        page: input.page,
        pages: Math.ceil(results / input.pageSize),
        pageSize: input.pageSize,
        results,
      };
    }),
  report: adminProcedure.input(z.string()).handler(async ({ input }) => {
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
      throw new ORPCError("NOT_FOUND");
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
    .handler(async ({ input, context }) => {
      const values = input.data.handled
        ? { handled: true, handled_by_id: context.user.id, notes: input.data.notes }
        : { handled: false, handled_by_id: null, notes: input.data.notes };

      const r = await db
        .update(report)
        .set(values)
        .where(eq(report.id, input.reportId))
        .returning();

      return r[0];
    }),
  deleteReport: adminProcedure.input(z.string()).handler(async ({ input }) => {
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
    .handler(async ({ input, context }) => {
      const r = await db
        .insert(report)
        .values({
          id: crypto.randomUUID(),
          reason: input.reason,
          timestamp: new Date(),
          reported_id: input.userId,
          reporter_id: context.user.id,
        })
        .returning();

      return r[0];
    }),
};
