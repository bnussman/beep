import { Elipsis } from "@/components/Elipsis";
import { Menu } from "@/components/Menu";
import { call, sms } from "@/utils/links";
import { useTRPC } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { useGlobalSearchParams, useRouter } from "expo-router";

interface Props {
  userId: string;
}

export function useUserMenuOptions(userId: string) {
  const router = useRouter();
  const trpc = useTRPC();
  const { beepId } = useGlobalSearchParams<{ beepId: string }>();

  const { data: userDetails } = useQuery(
    trpc.user.getUserPrivateDetails.queryOptions(userId),
  );

  return [
    {
      title: "Call",
      show: !!userDetails,
      onClick: () => call(userId),
    },
    {
      title: "Text",
      show: !!userDetails,
      onClick: () => sms(userId),
    },
    {
      title: "Report",
      onClick: () => router.push({ pathname: '/user/[id]/report', params: { id: userId, beepId } }),
    },
  ];
}

export function UserMenu({ userId }: Props) {
  const options = useUserMenuOptions(userId);

  return (
    <Menu
      trigger={<Elipsis />}
      options={options}
    />
  );
}
