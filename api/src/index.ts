import * as Sentry from "@sentry/bun";
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
import { ENVIRONMENT, SENTRY_DSN } from "./utils/constants";
import { healthRouter } from "./routers/health";
import { createBunHttpHandler, createBunWSHandler } from "trpc-bun-adapter";

Sentry.init({
  dsn: SENTRY_DSN,
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
  health: healthRouter,
});

export type AppRouter = typeof appRouter;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Vary',
};

// const handler = createHTTPHandler({
//   middleware: cors(),
//   router: appRouter,
//   createContext,
// });

// const httpServer = createServer((req, res) => {
//   const request = incomingMessageToRequest(req, { maxBodySize: 20_000 });

//   if (request.url.endsWith("/payments/webhook")) {
//     handlePaymentWebook(request, res);
//   } else {
//     handler(req, res);
//   }
// });

// const wss = new ws.Server({ server: httpServer });

// applyWSSHandler<AppRouter>({
//   onError: console.error,
//   wss,
//   router: appRouter,
//   createContext,
// });

// httpServer.listen(3000);

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
  // batching: {
  //     enabled: true,
  // },
  emitWsUpgrades: true, // pass true to upgrade to WebSocket
});

const websocket = createBunWSHandler({
  router: appRouter,
  // optional arguments:
  createContext,
  onError: console.error,
  // batching: {
  //     enabled: true,
  // },
});

Bun.serve({
  fetch(request, response) {
      if (request.method === 'OPTIONS') {
        const res = new Response('Departed', { headers: CORS_HEADERS });
        return res;
      }
      return bunHandler(request, response) ?? new Response("Not found", {status: 404});
  },
  websocket
});

console.info("🚕 Beep API Server Started");
console.info("➡️  Listening on http://0.0.0.0:3000");
console.info("➡️  Listening on ws://0.0.0.0:3000");
