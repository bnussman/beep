import React, { useState } from "react";
import { RateBar } from "@/components/Rate";
import { Input } from "@/components/Input";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import { ActivityIndicator } from "react-native";
import { Avatar } from "@/components/Avatar";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";

type Props = StaticScreenProps<{ userId: string; beepId: string }>;

export function RateScreen({ route }: Props) {
  const [stars, setStars] = useState<number>(0);
  const [message, setMessage] = useState<string>();

  const { goBack } = useNavigation();
  const queryClient = useQueryClient();

  const { data: user } = useQuery(
    orpc.user.publicUser.queryOptions({ input: route.params.userId }),
  );

  const { mutateAsync: rate, isPending } = useMutation(
    orpc.rating.createRating.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: orpc.beep.beeps.key() });
        queryClient.invalidateQueries({ queryKey: orpc.rating.ratings.key() });
        queryClient.invalidateQueries({
          queryKey: orpc.rider.getLastBeepToRate.queryKey(),
        });
        goBack();
      },
      onError(error) {
        alert(error.message);
      },
    }),
  );

  const onSubmit = () => {
    rate({
      userId: route.params.userId,
      beepId: route.params.beepId,
      message: message,
      stars: stars,
    });
  };

  if (!user) {
    return <ActivityIndicator />;
  }

  return (
    <View style={{ padding: 16, gap: 16 }}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text size="3xl" weight="800" style={{ flexShrink: 1 }}>
          {user.first} {user.last}
        </Text>
        <Avatar src={user.photo ?? undefined} />
      </View>
      <View style={{ gap: 12 }}>
        <Text weight="bold">Stars</Text>
        <RateBar hint="Stars" value={stars} onValueChange={setStars} />
      </View>
      <View style={{ gap: 12 }}>
        <Text>
          <Text weight="bold">Message</Text> (optional)
        </Text>
        <Input
          multiline
          onChangeText={(text) => setMessage(text)}
          onSubmitEditing={onSubmit}
          style={{ height: 100 }}
          autoFocus
        />
      </View>
      <Button onPress={onSubmit} disabled={stars < 1} isLoading={isPending}>
        Rate User
      </Button>
    </View>
  );
}
