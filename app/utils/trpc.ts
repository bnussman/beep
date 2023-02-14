import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@beep/api";

export const trpc = createTRPCReact<AppRouter>();
