import * as Sentry from "@sentry/bun";
import { StandardHandlerInterceptor } from "@orpc/server/standard";
import { Context } from "../utilities/context";

export const otelAbortSignalCaptureInterceptor: StandardHandlerInterceptor<Context> = ({ request, next }) => {
  const span = Sentry.getActiveSpan();

  request.signal?.addEventListener('abort', () => {
    span?.addEvent('aborted', { reason: String(request.signal?.reason) })
  })

  return next()
};