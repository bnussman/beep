import React, { useEffect } from "react";
import * as Sentry from "@sentry/react";
import { useSubscription } from "../utils/subscriptions";
import { orpc } from "../utils/orpc";
import { UserMenu } from "./UserMenu";
import { AdminMenu } from "./AdminMenu";
import { createLink, Link as RouterLink, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@heroui/react";

const LinkButton = createLink(Button);

export function Header() {
  const queryClient = useQueryClient();

  const { data: user } = useQuery(
    orpc.user.me.queryOptions({
      retry: false,
      refetchOnWindowFocus: false,
    }),
  );

  useSubscription({
    ...orpc.user.updates.liveOptions({
      enabled: user !== undefined,
      context: { ws: true }
    }),
    onData(data) {
      queryClient.setQueryData(orpc.user.me.queryKey(), data);
    }
  })

  useEffect(() => {
    Sentry.setUser(user ?? null);
  }, [user]);

  return (
    <header
      className="fixed top-0 z-50 w-full border-b backdrop-blur-[5px]"
      style={{
        borderColor: "light-dark(rgba(0, 0, 0, 0.12), rgba(131, 131, 131, 0.1))",
        backgroundColor: "light-dark(transparent, rgba(44, 44, 44, 0.1))",
      }}
    >
      <nav className="flex h-14 items-center justify-between px-4 md:h-16 md:px-6">
        <RouterLink to="/" className="flex items-center gap-2 no-underline">
          <span className="hidden text-2xl font-bold md:block">
            Ride Beep App
          </span>
          <span className="text-2xl" aria-label="Taxi">
            🚕
          </span>
        </RouterLink>
        <div className="flex items-center gap-2">
          {user?.role === "admin" && <AdminMenu />}
          {user && <UserMenu />}
          {!user && (
            <>
              <LinkButton
                to="/login"
                variant="tertiary"
              >
                Login
              </LinkButton>
              <LinkButton
                variant="primary"
                to="/signup"
              >
                Sign Up
              </LinkButton>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
