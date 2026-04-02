import { openapi } from "../utils/openapi";
import { createClientAPIPage } from "fumadocs-openapi/ui/create-client";

// @ts-expect-error idk
export const ClientAPIPage = createClientAPIPage(openapi);
