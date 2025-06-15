import SchemaBuilder from '@pothos/core';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import type { UserTypeFromDB } from './types';

interface Context {
  user: UserTypeFromDB | null;
}

export const builder = new SchemaBuilder<{
  Context: Context;
  AuthScopes: {
    loggedIn: boolean;
    admin: boolean;
  };
  AuthContexts: {
    loggedIn: Context & { user: UserTypeFromDB };
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