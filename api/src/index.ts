import { captureException } from "@sentry/node";
import { createContext, router } from "./utils/trpc.ts";
import { userRouter } from "./routers/user.ts";
import { authRouter } from "./routers/auth.ts";
import { reportRouter } from "./routers/report.ts";
import { ratingRouter } from "./routers/rating.ts";
import { carRouter } from "./routers/car.ts";
import { beepRouter } from "./routers/beep.ts";
import { paymentRouter } from "./routers/payment.ts";
import { feedbackRouter } from "./routers/feedback.ts";
import { notificationRouter } from "./routers/notification.ts";
import { redisRouter } from "./routers/redis.ts";
import { riderRouter } from "./routers/rider.ts";
import { beeperRouter } from "./routers/beeper.ts";
import { locationRouter } from "./routers/location.ts";
import { handlePaymentWebook } from "./utils/payments.ts";
import { healthRouter } from "./routers/health.ts";
import { createBunWSHandler } from "./utils/ws.ts";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { CORS_HEADERS } from "./utils/cors.ts";
import { flagsRouter } from "./routers/flags.ts";

const appRouter = router({
  user: userRouter,
  auth: authRouter,
  report: reportRouter,
  rating: ratingRouter,
  car: carRouter,
  beep: beepRouter,
  payment: paymentRouter,
  feedback: feedbackRouter,
  notification: notificationRouter,
  redis: redisRouter,
  rider: riderRouter,
  beeper: beeperRouter,
  location: locationRouter,
  health: healthRouter,
  flags: flagsRouter,
});

export type AppRouter = typeof appRouter;

const websocket = createBunWSHandler({
  router: appRouter,
  createContext,
  onError(error) {
    if (getHTTPStatusCodeFromError(error.error) >= 500) {
      console.error(error.error);
      captureException(error.error, {
        extra: { input: error.input, type: error.type },
      });
    }
  },
});

Bun.serve({
  routes: {
    "/payments/webhook": handlePaymentWebook,
  },
  fetch(request, server) {
    if (request.method === "OPTIONS") {
      return new Response("Departed", { headers: CORS_HEADERS });
    }
    if (
      server.upgrade(request, {
        data: {
          req: request,
          abortController: new AbortController(),
          abortControllers: new Map(),
        },
      })
    ) {
      return;
    }
    return fetchRequestHandler({
      endpoint: "/",
      req: request,
      router: appRouter,
      createContext,
      onError(error) {
        if (error.req.url.includes("syncPayments")) {
          console.error("Error syncing payments", error);
          captureException(error.error, {
            extra: { input: error.input, type: error.type },
          });
        }
        if (getHTTPStatusCodeFromError(error.error) >= 500) {
          console.error(error.error);
          captureException(error.error, {
            extra: { input: error.input, type: error.type },
          });
        }
      },
      responseMeta() {
        return { headers: CORS_HEADERS };
      },
    });
  },
  websocket,
});

console.info("🚕 Beep API Server Started");
console.info("➡️  Listening on http://0.0.0.0:3000");
console.info("➡️  Listening on ws://0.0.0.0:3000");
