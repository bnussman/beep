import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../utils/root';

export const adminRoute = createRoute({
  path: 'admin',
  getParentRoute: () => rootRoute,
});
