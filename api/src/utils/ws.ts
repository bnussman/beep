// Credit to https://github.com/cah4a/trpc-bun-adapter
// This is a modified version of the WS adpater
import {
  type AnyRouter,
  TRPCError,
  callTRPCProcedure,
  getErrorShape,
  getTRPCErrorFromUnknown,
  type inferRouterContext,
  isTrackedEnvelope,
  transformTRPCResponse,
} from "@trpc/server";
import { parseConnectionParamsFromUnknown } from "@trpc/server/http";
import type { TRPCRequestInfo } from "@trpc/server/http";
import {
  isObservable,
  Observable,
  Unsubscribable,
} from "@trpc/server/observable";
import {
  type TRPCClientOutgoingMessage,
  type TRPCResponseMessage,
  type TRPCResultMessage,
  parseTRPCMessage,
} from "@trpc/server/rpc";
import type { CreateContextCallback } from "@trpc/server";
import {
  type BaseHandlerOptions,
} from "@trpc/server/http";
import type { TRPCConnectionParamsMessage } from "@trpc/server/rpc";
import type { MaybePromise, Result } from "@trpc/server/unstable-core-do-not-import";
import type { ServerWebSocket, WebSocketHandler } from "bun";
import { NodeHTTPCreateContextFnOptions } from "@trpc/server/adapters/node-http";
import * as Sentry from '@sentry/bun';

/**
 * @internal
 */
function observableToReadableStream<TValue>(
  observable: Observable<TValue, unknown>,
  signal: AbortSignal,
): ReadableStream<Result<TValue>> {
  let unsub: Unsubscribable | null = null;

  const onAbort = () => {
    unsub?.unsubscribe();
    unsub = null;
    signal.removeEventListener('abort', onAbort);
  };

  return new ReadableStream<Result<TValue>>({
    start(controller) {
      unsub = observable.subscribe({
        next(data) {
          try {
            controller.enqueue({ ok: true, value: data });
          } catch (error) {
            Sentry.captureException(error);
          }
        },
        error(error) {
          controller.enqueue({ ok: false, error });
          controller.close();
        },
        complete() {
          controller.close();
        },
      });

      if (signal.aborted) {
        onAbort();
      } else {
        signal.addEventListener('abort', onAbort, { once: true });
      }
    },
    cancel() {
      onAbort();
    },
  });
}


export function observableToAsyncIterable<TValue>(
  observable: Observable<TValue, unknown>,
  signal: AbortSignal,
): AsyncIterable<TValue> {
  const stream = observableToReadableStream(observable, signal);

  const reader = stream.getReader();
  const iterator: AsyncIterator<TValue> = {
    async next() {
      const value = await reader.read();
      if (value.done) {
        return {
          value: undefined,
          done: true,
        };
      }
      const { value: result } = value;
      if (!result.ok) {
        throw result.error;
      }
      return {
        value: result.value,
        done: false,
      };
    },
    async return() {
      await reader.cancel();
      return {
        value: undefined,
        done: true,
      };
    },
  };
  return {
    [Symbol.asyncIterator]() {
      return iterator;
    },
  };
}

export type CreateBunWSSContextFnOptions<TRouter extends AnyRouter> =
NodeHTTPCreateContextFnOptions<
  Request,
  ServerWebSocket<BunWSClientCtx<TRouter>>
>;

export type BunWSAdapterOptions<TRouter extends AnyRouter> = BaseHandlerOptions<
  TRouter,
  Request
> &
CreateContextCallback<
  inferRouterContext<TRouter>,
  (
    opts: CreateBunWSSContextFnOptions<TRouter>,
  ) => MaybePromise<inferRouterContext<TRouter>>
>;

export type BunWSClientCtx<TRouter extends AnyRouter> = {
  req: Request;
  abortController: AbortController;
  ctx?: Promise<inferRouterContext<TRouter>>;
  abortControllers: Map<string | number, AbortController>;
};

export function createBunWSHandler<TRouter extends AnyRouter>(
  opts: BunWSAdapterOptions<TRouter>,
): WebSocketHandler<BunWSClientCtx<TRouter>> {
  const { router, createContext } = opts;

  const respond = (
    client: ServerWebSocket<unknown>,
    untransformedJSON: TRPCResponseMessage,
  ) => {
    client.send(
      JSON.stringify(
        transformTRPCResponse(
          opts.router._def._config,
          untransformedJSON,
        ),
      ),
    );
  };

  async function createClientCtx(
    client: ServerWebSocket<BunWSClientCtx<inferRouterContext<TRouter>>>,
    connectionParams: TRPCRequestInfo["connectionParams"],
  ) {
    const ctxPromise = createContext?.({
      req: client.data.req,
      res: client,
      info: {
        connectionParams,
        calls: [],
        isBatchCall: false,
        accept: null,
        type: "unknown",
        signal: client.data.abortController.signal,
        url: null
      },
    });

    try {
      return await ctxPromise;
    } catch (cause) {
      const error = getTRPCErrorFromUnknown(cause);
      opts.onError?.({
        error,
        path: undefined,
        type: "unknown",
        ctx: undefined,
        req: client.data.req,
        input: undefined,
      });
      respond(client, {
        id: null,
        error: getErrorShape({
          config: router._def._config,
          error,
          type: "unknown",
          path: undefined,
          input: undefined,
          ctx: undefined,
        }),
      });
    }
  }

  async function handleRequest(
    client: ServerWebSocket<BunWSClientCtx<inferRouterContext<TRouter>>>,
    msg: TRPCClientOutgoingMessage,
  ) {
    const { id, jsonrpc } = msg;

    if (msg.id === null) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "`id` is required",
      });
    }

    if (msg.method === "subscription.stop") {
      client.data.abortControllers.get(msg.id)?.abort();
      return;
    }

    const { path, lastEventId } = msg.params;
    let { input } = msg.params;
    const type = msg.method;
    const req = client.data.req;

    try {
      if (lastEventId !== undefined) {
        if (isObject(input)) {
          input = {
            ...input,
            lastEventId: lastEventId,
          };
        } else {
          input ??= {
            lastEventId: lastEventId,
          };
        }
      }

      const ctx = await client.data.ctx;

      const abortController = new AbortController();

      const result = await callTRPCProcedure({
        router,
        path,
        getRawInput: () => Promise.resolve(input),
        ctx,
        type,
        signal: abortController.signal,
      });

      const isIterableResult =
        isAsyncIterable(result) || isObservable(result);

      if (type !== "subscription") {
        if (isIterableResult) {
          throw new TRPCError({
            code: "UNSUPPORTED_MEDIA_TYPE",
            message: `Cannot return an async iterable or observable from a ${type} procedure with WebSockets`,
          });
        }
        // send the value as data if the method is not a subscription
        respond(client, {
          id,
          jsonrpc,
          result: {
            type: "data",
            data: result,
          },
        });
        return;
      }

      if (!isIterableResult) {
        throw new TRPCError({
          message: `Subscription ${path} did not return an observable or a AsyncGenerator`,
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      if (client.readyState !== WebSocket.OPEN) {
        // if the client got disconnected whilst initializing the subscription
        // no need to send stopped message if the client is disconnected
        return;
      }

      if (client.data.abortControllers.has(id!)) {
        // duplicate request ids for client
        throw new TRPCError({
          message: `Duplicate id ${id}`,
          code: "BAD_REQUEST",
        });
      }

      const iterable = isObservable(result)
        ? observableToAsyncIterable(result, abortController.signal)
        : result;

      run(async () => {
        const iterator: AsyncIterator<unknown> =
          iterable[Symbol.asyncIterator]();

        const abortPromise = new Promise<"abort">((resolve) => {
          abortController.signal.onabort = () => resolve("abort");
        });

        // We need those declarations outside the loop for garbage collection reasons. If they
        // were declared inside, they would not be freed until the next value is present.
        let next:
          | null
          | TRPCError
          | Awaited<
            typeof abortPromise | ReturnType<(typeof iterator)['next']>
          >;
        let result: null | TRPCResultMessage<unknown>['result'];

        while (true) {
          next = await Promise.race([
            iterator.next().catch(getTRPCErrorFromUnknown),
            abortPromise,
          ]);

          if (next === "abort") {
            await iterator.return?.();
            break;
          }

          if (next instanceof Error) {
            const error = getTRPCErrorFromUnknown(next);
            opts.onError?.({
              error,
              path,
              type,
              ctx,
              req,
              input,
            });
            respond(client, {
              id,
              jsonrpc,
              error: getErrorShape({
                config: router._def._config,
                error,
                type,
                path,
                input,
                ctx,
              }),
            });
            break;
          }

          if (next.done) {
            break;
          }

          result = {
            type: "data",
            data: next.value,
          };

          if (isTrackedEnvelope(next.value)) {
            const [id, data] = next.value;
            result.id = id;
            result.data = {
              id,
              data,
            };
          }

          respond(client, {
            id,
            jsonrpc,
            result,
          });

          // free up references for garbage collection
          next = null;
          result = null;
        }

        respond(client, {
          id,
          jsonrpc,
          result: {
            type: "stopped",
          },
        });
      })
        .catch((cause) => {
          const error = getTRPCErrorFromUnknown(cause);
          opts.onError?.({ error, path, type, ctx, req, input });
          respond(client, {
            id,
            jsonrpc,
            error: getErrorShape({
              config: router._def._config,
              error,
              type,
              path,
              input,
              ctx,
            }),
          });
          abortController.abort();
        });

      client.data.abortControllers.set(id!, abortController);

      respond(client, {
        id,
        jsonrpc,
        result: {
          type: "started",
        },
      });
    } catch (cause) {
      // procedure threw an error
      const error = getTRPCErrorFromUnknown(cause);
      opts.onError?.({ error, path, type, ctx: client.data.ctx, req, input });
      respond(client, {
        id,
        jsonrpc,
        error: getErrorShape({
          config: router._def._config,
          error,
          type,
          path,
          input,
          ctx: client.data.ctx,
        }),
      });
    }
  }

  return {
    open(client) {
      client.data.abortController = new AbortController();
      client.data.abortControllers = new Map();

      if (client.data.req.url) {

        const connectionParams =
          new URL(client.data.req.url).searchParams.get(
            "connectionParams",
          ) === "1";

        if (!connectionParams) {
          client.data.ctx = createClientCtx(client, null);
        }
      }
    },

    async close(client) {
      for (const sub of client.data.abortControllers.values()) {
        sub.abort();
      }
      client.data.abortControllers.clear();
      client.data.abortController.abort();
    },

    async message(client, message) {
      const msgStr = message.toString();

      if (msgStr === "PONG") {
        return;
      }

      if (msgStr === "PING") {
        client.send("PONG");
        return;
      }

      try {
        const msgJSON: unknown = JSON.parse(msgStr);
        const msgs: unknown[] = Array.isArray(msgJSON)
          ? msgJSON
          : [msgJSON];

        if (!client.data.ctx) {
          const msg = msgs.shift() as TRPCConnectionParamsMessage;

          client.data.ctx = createClientCtx(
            client,
            parseConnectionParamsFromUnknown(msg.data),
          );
        }

        const promises = [];

        for (const raw of msgs) {
          const msg = parseTRPCMessage(
            raw,
            router._def._config.transformer,
          );
          promises.push(handleRequest(client, msg));
        }

        await Promise.all(promises);
      } catch (cause) {
        const error = new TRPCError({
          code: "PARSE_ERROR",
          cause,
        });

        respond(client, {
          id: null,
          error: getErrorShape({
            config: router._def._config,
            error,
            type: "unknown",
            path: undefined,
            input: undefined,
            ctx: undefined,
          }),
        });
      }
    },
  };
}

// util functions of @trpc/server that are not exported, unfortunately
function isAsyncIterable<TValue>(
  value: unknown,
): value is AsyncIterable<TValue> {
  return isObject(value) && Symbol.asyncIterator in value;
}

function run<TValue>(fn: () => TValue): TValue {
  return fn();
}

function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && !Array.isArray(value) && typeof value === "object";
}
