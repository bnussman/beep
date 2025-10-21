import { Elipsis } from "@/components/Elipsis";
import { Menu } from "@/components/Menu";
import { call, sms } from "@/utils/links";
import { useTRPC } from "@/utils/trpc";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";

interface Props {
  userId: string;
}

export function UserMenu({ userId }: Props) {
  const navigation = useNavigation();
  const trpc = useTRPC();

  const { data: userDetails } = useQuery(
    trpc.user.getUserPrivateDetails.queryOptions(userId),
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
