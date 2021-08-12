import { extractTraceparentData, stripUrlQueryAndFragment } from "@sentry/tracing";
import domain from "domain";
import { Context, Next } from "koa";
import * as Sentry from '@sentry/node';
import packageConfig from '../../package.json';

export const initSentry = () => {
    Sentry.init({
        release: `@beep/api@${packageConfig.version}`,
        dsn: process.env.SENTRY_URL,
        environment: process.env.GITLAB_ENVIRONMENT_NAME || "development",
        tracesSampleRate: 1.0,
        debug: true
    });
};

export const setSentryUserContext = (user: any) => {
    Sentry.setUser(user);
};

export const errorHandler = (err: any, ctx: any) => {
    Sentry.withScope(scope => {
        scope.addEventProcessor(event => {
            return Sentry.Handlers.parseRequest(event, ctx.request);
        });
        Sentry.captureException(err);
    });
};

// not mandatory, but adding domains does help a lot with breadcrumbs
export const requestHandler = (ctx: Context, next: Next): Promise<void> => {
  return new Promise<void>((resolve, _) => {
    const local = domain.create();
    // @ts-expect-error idk
    local.add(ctx);
    local.on("error", err => {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit("error", err, ctx);
    });
    local.run(async () => {
      Sentry.getCurrentHub().configureScope(scope =>
        scope.addEventProcessor(event =>
          Sentry.Handlers.parseRequest(event, ctx.request, { user: false })
        )
      );
      await next();
      resolve();
    });
  });
};

// this tracing middleware creates a transaction per request
export const tracingMiddleWare = async (ctx: Context, next: Next): Promise<void> => {
  const reqMethod = (ctx.method || "").toUpperCase();
  const reqUrl = ctx.url && stripUrlQueryAndFragment(ctx.url);

  if (reqUrl == "/.well-known/apollo/server-health") {
      await next();
      return;
  }

  // connect to trace of upstream app
  let traceparentData;
  if (ctx.request.get("sentry-trace")) {
    traceparentData = extractTraceparentData(ctx.request.get("sentry-trace"));
  }

  let body = undefined;

  try {
    body = JSON.parse(ctx.request.rawBody);
  }
  catch (e) {
    // ...
  }

  const transaction = Sentry.startTransaction({
    name: `${reqMethod} ${body?.operationName || reqUrl}`,
    op: "http.server",
    ...traceparentData,
  });

  ctx.__sentry_transaction = transaction;
  
  // We put the transaction on the scope so users can attach children to it
  Sentry.getCurrentHub().configureScope(scope => {
    scope.setSpan(transaction);
  });

  ctx.res.on("finish", () => {
    // Push `transaction.finish` to the next event loop so open spans have a chance to finish before the transaction closes
    setImmediate(() => {
      // if using koa router, a nicer way to capture transaction using the matched route
      if (ctx._matchedRoute) {
        const mountPath = ctx.mountPath || "";
        transaction.setName(`${reqMethod} ${mountPath}${ctx._matchedRoute}`);
      }
      transaction.setHttpStatus(ctx.status);
      transaction.finish();
    });
  });

  await next();
};
