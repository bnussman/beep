import React from "react";
import { orpc } from "../../../../utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { Alert, Spinner, Tabs, Typography } from "@heroui/react";

export const Route = createFileRoute('/admin/users/$userId/edit')({
  component: Edit,
});

function Edit() {
  const { userId } = Route.useParams();
  const navigate = useNavigate({ from: Route.id });

  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  const { isLoading, error } = useQuery(
    orpc.user.user.queryOptions({ input: userId })
  );

  if (isLoading) {
    return <Spinner size="xl" />;
  }

  if (error) {
    return (
      <Alert status="danger">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>{error.message}</Alert.Title>
        </Alert.Content>
      </Alert>
    );
  }

  const selectedTab = pathname.endsWith("location") ? "location" : "details";

  return (
    <div className="flex flex-col gap-4">
      <Typography type="h1">
        Edit
      </Typography>
      <div className="flex flex-col gap-6">
        <Tabs
          selectedKey={selectedTab}
        >
          <Tabs.ListContainer className="border-b border-separator">
            <Tabs.List aria-label="Edit user">
              <Tabs.Tab id="details" render={(props: any) => <Link to="/admin/users/$userId/edit/$" params={{ userId }} {...props} />}>
                Details
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="location" render={(props: any) => <Link to="/admin/users/$userId/edit/location" params={{ userId }} {...props} />}>
                Location
                <Tabs.Indicator />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
        </Tabs>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
