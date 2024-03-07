import { createTRPCReact, httpBatchLink } from '@trpc/react-query';
import type { AppRouter } from '../../api/src/index';
import { QueryClient } from '@tanstack/react-query';
 
export const trpc = createTRPCReact<AppRouter>();

export const queryClient = new QueryClient();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
    }),
  ],
});
