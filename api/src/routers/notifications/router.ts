import { db } from "../../utils/db";
import { users } from "../../../drizzle/schema";
import { like, and, isNotNull } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import { adminProcedure } from "../../utils/orpc";
import { sendNotificationInputSchema, sendNotificationToUserInputSchema } from "./schemas";
import {
  sendNotification,
  sendNotificationsBatch,
} from "../../utils/notifications";

export const notificationRouter = {
  sendNotification: adminProcedure
    .input(sendNotificationInputSchema)
    .handler(async ({ input }) => {
      const usersData = await db
        .select({ pushToken: users.pushToken })
        .from(users)
        .where(
          and(
            isNotNull(users.pushToken),
            input.emailMatch ? like(users.email, input.emailMatch) : undefined,
          ),
        );

      const to = usersData
        .map((u) => u.pushToken)
        .filter((pushToken) => pushToken !== null);

      await sendNotificationsBatch(to, input.title, input.body);

      return to.length;
    }),
  sendNotificationToUser: adminProcedure
    .input(sendNotificationToUserInputSchema)
    .handler(async ({ input }) => {
      const user = await db.query.users.findFirst({
        where: { id: input.userId },
      });

      if (!user) {
        throw new ORPCError("NOT_FOUND", {
          message: "User not found.",
        });
      }

      if (!user.pushToken) {
        throw new ORPCError("BAD_REQUEST", {
          message:
            "User does not have a push token. Can't send them a notification.",
        });
      }

      await sendNotification({
        to: user.pushToken,
        title: input.title,
        body: input.body,
      });
    }),
};
