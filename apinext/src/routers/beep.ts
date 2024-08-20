import { z } from "zod";
import { adminProcedure, router } from "../utils/trpc";
import { db } from "../utils/db";
import { count, desc, eq, or, and } from "drizzle-orm";
import { beep } from "../../drizzle/schema";

const inProgressBeep = or(
  eq(beep.status, "waiting"),
  eq(beep.status, "accepted"),
  eq(beep.status, "here"),
  eq(beep.status, "in_progress"),
  eq(beep.status, "on_the_way"),
);

export const beepRouter = router({
  beeps: adminProcedure
    .input(
      z.object({
        offset: z.number(),
        show: z.number(),
        inProgress: z.boolean().optional(),
        userId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const where = and(
        input.inProgress ? inProgressBeep : undefined,
        input.userId ? or(eq(beep.rider_id, input.userId), eq(beep.beeper_id, input.userId)) : undefined,
      );

      const beeps = await db.query.beep.findMany({
        offset: input.offset,
        limit: input.show,
        where,
        orderBy: desc(beep.start),
        with: {
          beeper: {
            columns: {
              id: true,
              first: true,
              last: true,
              photo: true,
            },
          },
          rider: {
            columns: {
              id: true,
              first: true,
              last: true,
              photo: true,
            },
          },
        },
      });

      const beepsCount = await db
        .select({ count: count() })
        .from(beep)
        .where(where);

      return {
        beeps,
        count: beepsCount[0].count
      };
    })
});
