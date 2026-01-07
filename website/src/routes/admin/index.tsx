import React from 'react';
import { createRoute, Outlet } from '@tanstack/react-router';
import { rootRoute } from '../../utils/root';
import { AdminLayout } from '../../components/AdminLayout';

export const adminRoute = createRoute({
  path: 'admin',
  getParentRoute: () => rootRoute,
  component: AdminRouteComponent,
});

function AdminRouteComponent() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
