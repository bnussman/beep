import React, { useState } from "react";
import { RateBar } from "@/components/Rate";
import { UserHeader } from "@/components/UserHeader";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import { trpc } from "@/utils/trpc";

type Props = StaticScreenProps<{ userId: string; beepId: string }>;

export function RateScreen({ route }: Props) {
  const [stars, setStars] = useState<number>(0);
  const [message, setMessage] = useState<string>();

  const { goBack } = useNavigation();
  const utils = trpc.useUtils();

  const { data: user } = trpc.user.user.useQuery(route.params.userId);
  const { mutateAsync: rate, isPending } = trpc.rating.createRating.useMutation(
    {
      onSuccess() {
        utils.beep.beeps.invalidate();
        utils.rating.ratings.invalidate();
        goBack();
      },
      onError(error) {
        alert(error.message);
      },
    },
  );

  const onSubmit = () => {
    rate({
      userId: route.params.userId,
      beepId: route.params.beepId,
      message: message,
      stars: stars,
    });
  };

  return (
    <View className="p-4 gap-4">
      {user && (
        <UserHeader
          username={user.username}
          name={`${user.first} ${user.last}`}
          picture={user.photo}
        />
      )}
      <RateBar hint="Stars" value={stars} onValueChange={setStars} />
      <Text>Message (optional)</Text>
      <Input
        multiline
        className="h-24"
        returnKeyType="go"
        onChangeText={(text) => setMessage(text)}
        onSubmitEditing={onSubmit}
        blurOnSubmit={true}
      />
      <Button onPress={onSubmit} disabled={stars < 1} isLoading={isPending}>
        Rate User
      </Button>
    </View>
  );
}
