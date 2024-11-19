import ws from 'ws';
import cors from 'cors';
import * as Sentry from '@sentry/bun';
import { createServer } from 'http';
import { createContext, router } from './utils/trpc';
import { createHTTPHandler } from '@trpc/server/adapters/standalone';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { userRouter } from './routers/user';
import { authRouter } from './routers/auth';
import { reportRouter } from "./routers/report";
import { ratingRouter } from "./routers/rating";
import { carRouter } from "./routers/car";
import { beepRouter } from "./routers/beep";
import { paymentRouter } from "./routers/payment";
import { feedbackRouter } from "./routers/feedback";
import { notificationRouter } from "./routers/notification";
import { redisRouter } from "./routers/redis";
import { riderRouter } from "./routers/rider";
import { beeperRouter } from "./routers/beeper";
import { locationRouter } from "./routers/location";
import { incomingMessageToRequest } from "@trpc/server/adapters/node-http";
import { handlePaymentWebook } from "./utils/payments";
import { healthRouter } from "./routers/health";

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
});

export type AppRouter = typeof appRouter;

const handler = createHTTPHandler({
  middleware: cors(),
  router: appRouter,
  createContext,
  onError(error) {
    console.error(error);
    if (error.error.code === "INTERNAL_SERVER_ERROR") {
      Sentry.captureException(error.error, { extra: { input: error.input } });
    }
  }
});

const httpServer = createServer((req, res) => {
  const request = incomingMessageToRequest(req, { maxBodySize: 20_000 });

  if (request.url.endsWith("/payments/webhook")) {
    return handlePaymentWebook(request, res);
  }

  return handler(req, res);
});

const wss = new ws.Server({ server: httpServer });

applyWSSHandler<AppRouter>({
  onError(error) {
    console.error(error);
    if (error.error.code === "INTERNAL_SERVER_ERROR") {
      Sentry.captureException(error.error, { extra: { input: error.input } });
    }
  },
  wss,
  router: appRouter,
  createContext,
});

httpServer.listen(3000);

console.info("🚕 Beep API Server Started");
console.info("➡️  Listening on http://0.0.0.0:3000");
console.info("➡️  Listening on ws://0.0.0.0:3000");
