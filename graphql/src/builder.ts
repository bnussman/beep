import SchemaBuilder from '@pothos/core';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import { User } from './types';

interface Context {
  user: User | null;
}

export const builder = new SchemaBuilder<{
  Context: Context;
  AuthScopes: {
    loggedIn: boolean;
    admin: boolean;
  };
  AuthContexts: {
    loggedIn: Context & { user: User };
  };
}>({
  plugins: [ScopeAuthPlugin],
  scopeAuth: {
    authScopes: async (context) => ({
      loggedIn: !!context.user,
      admin: context.user?.role === 'admin'
    }),
  },
});