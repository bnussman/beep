import { count, eq } from "drizzle-orm";
import { reports } from "../../../drizzle/schema";
import { db } from "../../utils/db";
import { adminProcedure, authedProcedure } from "../../utils/orpc";
import { z } from "zod";
import { ORPCError } from "@orpc/server";
import { condensedUserColumns } from "../users/logic";
import { createReportInputSchema, listReportsInputSchema, updateReportInputSchema } from "./schemas";

export const reportRouter = {
  reports: adminProcedure
    .input(listReportsInputSchema)
    .handler(async ({ input }) => {
      const where = input.userId
        ? {
            OR: [{ reporter_id: input.userId }, { reported_id: input.userId }],
          }
        : {};

      const [reports, reportsCount] = await Promise.all([
        db.query.reports.findMany({
          offset: (input.page - 1) * input.pageSize,
          limit: input.pageSize,
          orderBy: { timestamp: "desc" },
          where,
          columns: {
            reported_id: false,
            reporter_id: false,
            handled_by_id: false,
          },
          with: {
            reported: {
              columns: condensedUserColumns,
            },
            reporter: {
              columns: condensedUserColumns,
            },
            handledBy: {
              columns: condensedUserColumns,
            },
          },
        }),
        db.query.reports.findMany({
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
  report: adminProcedure
    .input(z.uuid())
    .handler(async ({ input }) => {
      const report = await db.query.reports.findFirst({
        where: { id: input },
        columns: {
          reported_id: false,
          reporter_id: false,
          handled_by_id: false,
        },
        with: {
          reported: {
            columns: condensedUserColumns,
          },
          reporter: {
            columns: condensedUserColumns,
          },
          handledBy: {
            columns: condensedUserColumns,
          },
        },
      });

      if (!report) {
        throw new ORPCError("NOT_FOUND");
      }

      return report;
    }),
  updateReport: adminProcedure
    .input(updateReportInputSchema)
    .handler(async ({ input, context }) => {
      const values = input.data.handled
        ? { handled: true, handled_by_id: context.user.id, notes: input.data.notes }
        : { handled: false, handled_by_id: null, notes: input.data.notes };

      const [report] = await db
        .update(reports)
        .set(values)
        .where(eq(reports.id, input.reportId))
        .returning();

      return report;
    }),
  deleteReport: adminProcedure
    .input(z.uuid())
    .handler(async ({ input }) => {
      await db.delete(reports).where(eq(reports.id, input));
    }),
  createReport: authedProcedure
    .input(createReportInputSchema)
    .handler(async ({ input, context }) => {
      const [report] = await db
        .insert(reports)
        .values({
          id: crypto.randomUUID(),
          reason: input.reason,
          timestamp: new Date(),
          reported_id: input.userId,
          reporter_id: context.user.id,
          beep_id: input.beepId,
          rating_id: input.ratingId,
        })
        .returning();

      return report;
    }),
};
