import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../App';

export const adminRoute = createRoute({
  path: 'admin',
  getParentRoute: () => rootRoute,
});