import { createTRPCClient, httpLink } from '@trpc/client';
import type { AppRouter } from '../../../api/src/index';
import { cookies } from 'next/headers';

const trpcHttpLink = httpLink({
  url: 'http://localhost:3000/',
  async headers() {
    const token = (await cookies()).get('token');
    if (token) {
      return { Authorization: `Bearer ${token.value}` };
    }
    return {};
  }
});


export const trpc = createTRPCClient<AppRouter>({
  links: [trpcHttpLink]
});
