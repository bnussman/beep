import { os } from "@orpc/server";
import { errorTransformerMiddleware } from "../middleware/errors";
import { Context } from "../utilities/context";

export const o = os.$context<Context>().use(errorTransformerMiddleware);
