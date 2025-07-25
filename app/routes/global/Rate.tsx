import React, { useState } from "react";
import { RateBar } from "@/components/Rate";
import { Input } from "@/components/Input";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import { trpc } from "@/utils/trpc";
import { ActivityIndicator } from "react-native";
import { Avatar } from "@/components/Avatar";

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
        utils.rider.getLastBeepToRate.invalidate();
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

  if (!user) {
    return <ActivityIndicator />;
  }

  return (
    <View style={{ padding: 16, gap: 8 }}>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text size="3xl" weight="800" className="flex-shrink">
          {user.first} {user.last}
        </Text>
        <Avatar src={user.photo ?? undefined} />
      </View>
      <Text weight="bold">Stars</Text>
      <RateBar hint="Stars" value={stars} onValueChange={setStars} />
      <Text>
        <Text weight="bold">Message</Text>{' '}
        (optional)
      </Text>
      <Input
        multiline
        onChangeText={(text) => setMessage(text)}
        onSubmitEditing={onSubmit}
        style={{ height: 100 }}
        autoFocus
      />
      <Button onPress={onSubmit} disabled={stars < 1} isLoading={isPending}>
        Rate User
      </Button>
    </View>
  );
}
