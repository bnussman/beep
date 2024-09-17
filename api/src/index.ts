import * as Sentry from "@sentry/bun";
import ws from 'ws';
import cors from 'cors';
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
import { ENVIRONMENT } from "./utils/constants";
import { handlePaymentWebook } from "./utils/payments";

Sentry.init({
  dsn: "https://7dd69cf0a7fcbaecea5fadffc461727c@sentry.nussman.us/2",
  tracesSampleRate: 1.0,
  environment: ENVIRONMENT
});

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
});

export type AppRouter = typeof appRouter;

const handler = createHTTPHandler({
  middleware: cors(),
  router: appRouter,
  createContext,
});

const httpServer = createServer((req, res) => {
  const request = incomingMessageToRequest(req, { maxBodySize: 20_000 });

  if (request.url.endsWith("/payments/webhook")) {
    handlePaymentWebook(request, res);
  } else {
    handler(req, res);
  }
});

const wss = new ws.Server({ server: httpServer });

applyWSSHandler<AppRouter>({
  onError: console.error,
  wss,
  router: appRouter,
  createContext,
});

httpServer.listen(3001);

console.info("🚕 Beep API Server Started");
console.info("➡️  Listening on http://0.0.0.0:3001 and ws://0.0.0.0:3001");
