import { Elipsis } from "@/components/Elipsis";
import { Menu } from "@/components/Menu";
import { call, sms } from "@/utils/links";
import { orpc } from "@/utils/orpc";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";

interface Props {
  userId: string;
}

export function useUserMenuOptions(userId: string) {
  const navigation = useNavigation();

  const { data: userDetails } = useQuery(
    orpc.user.getUserPrivateDetails.queryOptions({ input: userId }),
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
      onClick: () => navigation.navigate("Report", { userId }),
    },
  ];
}

export function UserMenu({ userId }: Props) {
  const navigation = useNavigation();

  const { data: userDetails } = useQuery(
    orpc.user.getUserPrivateDetails.queryOptions({ input: userId }),
  );

  return (
    <Menu
      trigger={<Elipsis />}
      options={[
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
          onClick: () => navigation.navigate("Report", { userId }),
        },
      ]}
    />
  );
}
