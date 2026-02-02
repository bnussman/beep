import { z } from "zod";
import { adminProcedure } from "../utils/trpc";
import { db } from "../utils/db";
import { user } from "../../drizzle/schema";
import { like, and, isNotNull } from "drizzle-orm";
import {
  sendNotification,
  sendNotificationsBatch,
} from "../utils/notifications";
import { ORPCError } from "@orpc/server";

export const notificationRouter = {
  sendNotification: adminProcedure
    .input(
      z.object({
        title: z.string().min(3),
        body: z.string().min(5),
        emailMatch: z.string().optional(),
      }),
    )
    .handler(async ({ input }) => {
      const users = await db
        .select({ pushToken: user.pushToken })
        .from(user)
        .where(
          and(
            isNotNull(user.pushToken),
            input.emailMatch ? like(user.email, input.emailMatch) : undefined,
          ),
        );

      const to = users
        .map((u) => u.pushToken)
        .filter((pushToken) => pushToken !== null);

      await sendNotificationsBatch(to, input.title, input.body);

      return to.length;
    }),
  sendNotificationToUser: adminProcedure
    .input(
      z.object({
        title: z.string(),
        body: z.string(),
        userId: z.string(),
      }),
    )
    .handler(async ({ input }) => {
      const u = await db.query.user.findFirst({
        where: { id: input.userId },
      });

      if (!u) {
        throw new ORPCError("NOT_FOUND", { message: "User not found." });
      }

      if (!u.pushToken) {
        throw new ORPCError(
          "BAD_REQUEST", {
          message:
            "User does not have a push token. Can't send them a notification.",
        });
      }

      await sendNotification({
        to: u.pushToken,
        title: input.title,
        body: input.body,
      });
    }),
};
