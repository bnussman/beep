import { createContext, router } from './utils/trpc';
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
import { handlePaymentWebook } from "./utils/payments";
import { healthRouter } from "./routers/health";
import { createBunWSHandler } from './utils/ws';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

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

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Vary',
};

const websocket = createBunWSHandler({
  router: appRouter,
  createContext,
  onError: console.error,
});

Bun.serve({
  fetch(request, server) {
    if (request.method === 'OPTIONS') {
      return new Response('Departed', { headers: CORS_HEADERS });
    }
    if (server.upgrade(request, { data: { req: request } })) {
      return;
    }
    if (request.url.endsWith("/payments/webhook")) {
      return handlePaymentWebook(request);
    }
    return fetchRequestHandler({
      endpoint: '/',
      req: request,
      router: appRouter,
      createContext,
      responseMeta() {
        return { headers: CORS_HEADERS };
      }
    });
  },
  websocket
});

console.info("🚕 Beep API Server Started");
console.info("➡️  Listening on http://0.0.0.0:3000");
console.info("➡️  Listening on ws://0.0.0.0:3000");
