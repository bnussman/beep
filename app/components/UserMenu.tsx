import { Elipsis } from "@/components/Elipsis";
import { Menu } from "@/components/Menu";
import type { Option } from "@/components/Menu";
import { call, openCashApp, openVenmo, sms } from "@/utils/links";
import { useTRPC } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { useGlobalSearchParams, useRouter } from "expo-router";

interface Props {
  userId: string;
}

export function useUserMenuOptions(userId: string): Option[] {
  const router = useRouter();
  const trpc = useTRPC();
  const { beepId, ratingId } = useGlobalSearchParams<{ beepId: string, ratingId: string }>();

  const { data: user } = useQuery(
    trpc.user.publicUser.queryOptions(userId),
  );

  const { data: userDetails } = useQuery(
    trpc.user.getUserPrivateDetails.queryOptions(userId),
  );

  return [
    {
      title: "Contact",
      show: Boolean(userDetails?.phone),
      sfIcon: "phone.fill",
      options: [
        {
          title: "Call",
          sfIcon: 'phone.fill',
          onClick: () => call(userId),
        },
        {
          title: "Text",
          sfIcon: 'message.fill',
          onClick: () => sms(userId),
        },
      ],
    },
    {
      title: "Payment",
      sfIcon: 'creditcard.fill',
      options: [
        {
          title: "Venmo",
          show: Boolean(user?.venmo),
          sfIcon: 'creditcard.fill',
          onClick: () => openVenmo(user?.venmo),
        },
        {
          title: "Cash App",
          show: Boolean(user?.cashapp),
          sfIcon: 'dollarsign',
          onClick: () => openCashApp(user?.cashapp),
        },
      ],
    },
    {
      title: "Report",
      sfIcon: "exclamationmark.bubble.fill",
      onClick: () => router.push({ pathname: '/user/[id]/report', params: { id: userId, beepId, ratingId } }),
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
