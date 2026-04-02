import { openapiPlugin, openapiSource } from "fumadocs-openapi/server";
import { docs } from "../../.source/server";
import { InferPageType, loader, multiple } from "fumadocs-core/source";
import { openapi } from "./openapi";

export const source = loader(
  multiple({
    docs: docs.toFumadocsSource(),
    openapi: await openapiSource(openapi, {
      baseDir: "API",
    }),
  }),
  {
    baseUrl: "/docs",
    plugins: [openapiPlugin()],
  },
);
