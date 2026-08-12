import { useQuery } from "@tanstack/react-query";
import { orpc } from "./orpc";

export function useUser() {
  const { data: user, ...query } = useQuery(
    orpc.user.me.queryOptions({ enabled: false, retry: false })
  );

  return { user, ...query };
}
