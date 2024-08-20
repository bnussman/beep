import { z } from "zod";
import { adminProcedure, router } from "../utils/trpc";
import { db } from "../utils/db";
import { user } from "../../drizzle/schema";
import { like, and, isNotNull, eq } from 'drizzle-orm';
import { sendNotification, sendNotificationsBatch } from "../utils/notifications";
import { TRPCError } from "@trpc/server";

export const notificationRouter = router({
  sendNotification: adminProcedure
    .input(
      z.object({
        title: z.string(),
        body: z.string(),
        emailMatch: z.string().optional()
      }),
    )
    .mutation(async ({ input }) => {
      const users = await db
        .select({ pushToken: user.pushToken })
        .from(user)
        .where(
          and(
            isNotNull(user.pushToken),
            input.emailMatch ? like(user.email, input.emailMatch) : undefined
          )
        );

      const to = users.map(u => u.pushToken).filter(pushToken => pushToken !== null);

      await sendNotificationsBatch(to, input.title, input.body);

      return to.length;
    }),
  sendNotificationToUser: adminProcedure
    .input(
      z.object({
        title: z.string(),
        body: z.string(),
        userId: z.string()
      }),
    )
    .mutation(async ({ input }) => {
      const u = await db.query.user.findFirst({
        where: eq(user.id, input.userId),
      });

      if (!u) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found."
        });
      }

      if (!u.pushToken) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User does not have a push token. Can't send them a notification."
        });
      }

      await sendNotification({
        to: u.pushToken,
        title: input.title,
        body: input.body,
      });
    }),
});
