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
import { createBunHttpHandler } from 'trpc-bun-adapter';
import { createBunWSHandler } from './utils/ws';

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

const bunHandler = createBunHttpHandler({
  router: appRouter,
  endpoint: '/',
  createContext,
  onError: console.error,
  responseMeta(opts) {
      return {
        headers: CORS_HEADERS,
      }
  },
  emitWsUpgrades: false,
  // batching: {
  //     enabled: true,
  // },
});

const websocket = createBunWSHandler({
  router: appRouter,
  createContext,
  onError: console.error,
  batching: {
      enabled: true,
  },

});

Bun.serve({
  fetch(request, server) {
      if (request.method === 'OPTIONS') {
        return new Response('Departed', { headers: CORS_HEADERS });
      }
      if (server.upgrade(request, {data: {req: request}})) {
        console.log(request)
        return;
      }
      if (request.url.endsWith("/payments/webhook")) {
        return handlePaymentWebook(request);
      }
      return bunHandler(request, server) ?? new Response("Not found", {status: 404});
  },
  websocket
});

console.info("🚕 Beep API Server Started");
console.info("➡️  Listening on http://0.0.0.0:3000");
console.info("➡️  Listening on ws://0.0.0.0:3000");
