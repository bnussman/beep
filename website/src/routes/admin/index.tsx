import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../utils/router';

export const adminRoute = createRoute({
  path: 'admin',
  getParentRoute: () => rootRoute,
});