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
import { healthRouter } from "./routers/health.ts";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { CORS_HEADERS } from "./utils/cors.ts";
import { flagsRouter } from "./routers/flags.ts";
import { WebSocketServer } from 'ws';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { createHTTPServer } from "@trpc/server/adapters/standalone";

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

// http server
const server = createHTTPServer({
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
  responseMeta() {
    return { headers: CORS_HEADERS };
  },
});

// ws server
const wss = new WebSocketServer({ server });

applyWSSHandler<AppRouter>({
  wss,
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

server.listen(3000);

// @todo handle payment webhook with node http server
// routes: {
//   "/payments/webhook": handlePaymentWebook,
// },


console.info("🚕 Beep API Server Started");
console.info("➡️  Listening on http://0.0.0.0:3000");
console.info("➡️  Listening on ws://0.0.0.0:3000");
