import { useRouter } from "expo-router";
import { Menu, type Option } from "./Menu";
import { Button } from "./Button";
import { Elipsis } from "./Elipsis";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { useUser } from "@/utils/useUser";

interface Props {
  beepId: string;
}

export function useBeepMenuOptions(props: Props): Option[] {
  const { beepId } = props;
  const { user } = useUser();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: beep } = useQuery(orpc.beep.beep.queryOptions({ input: beepId }));

  const { mutateAsync: deleteRating } = useMutation(
    orpc.rating.deleteRating.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: orpc.rating.ratings.key()
        });
        queryClient.invalidateQueries(
          orpc.rider.getLastBeepToRate.queryOptions(),
        );
        queryClient.invalidateQueries({
          queryKey: orpc.beep.beeps.key()
        });
        queryClient.invalidateQueries({ queryKey: orpc.beep.beep.key({ input: beepId })});
      },
      onError(error) {
        alert(error.message);
      },
    }),
  );

  const otherUser = beep?.rider_id === user?.id ? beep?.beeper : beep?.rider;

  const myRating = beep?.ratings.find((rating) => rating.rater_id === user?.id);

  const hasRated = myRating !== undefined;

  const onReport = () => {
    if (!otherUser) {
      return alert("User not found");
    }

    router.push({
      pathname: "/user/[id]/report",
      params: { id: otherUser.id, beepId },
    });
  };

  const onRate = () => {
    if (!otherUser) {
      return alert("User not found");
    }

    router.push({
      pathname: "/user/[id]/rate",
      params: { id: otherUser.id, beepId },
    });
  };


  const onDeleteRating = () => {
    if (!myRating) {
      return alert("Rating not found.");
    }

    deleteRating({ ratingId: myRating.id });
  };

  return [
    {
      title: "Rate",
      sfIcon: "star.fill",
      show: !hasRated,
      onClick: onRate,
    },
    {
      title: "Report",
      sfIcon: "exclamationmark.bubble.fill",
      onClick: onReport
    },
    {
      title: "Delete Rating",
      onClick: onDeleteRating,
      sfIcon: "trash",
      destructive: true,
      show: hasRated,
    },
  ];
}


export function BeepMenu(props: Props) {
  const options = useBeepMenuOptions(props);

  return (
    <Menu
      trigger={({ onPress }) => (
        <Button variant="ghost" onPress={onPress}>
          <Elipsis />
        </Button>
      )}
      options={options}
    />
  );
}
