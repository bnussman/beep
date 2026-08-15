import { useState } from "react";
import { RateBar } from "@/components/Rate";
import { Input } from "@/components/Input";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { View } from "react-native";
import { ActivityIndicator } from "react-native";
import { Avatar } from "@/components/Avatar";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { orpc } from "@/utils/orpc";

export default function RateScreen() {
  const { id, beepId } = useLocalSearchParams<{ id: string; beepId: string }>();

  const [stars, setStars] = useState<number>(0);
  const [message, setMessage] = useState<string>();

  const { back } = useRouter();
  const queryClient = useQueryClient();

  const { data: user } = useQuery(orpc.user.publicUser.queryOptions({ input: id }));

  const { mutateAsync: rate, isPending } = useMutation(
    orpc.rating.createRating.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: orpc.beep.beeps.key() });
        queryClient.invalidateQueries({ queryKey: orpc.rating.ratings.key() });
        queryClient.invalidateQueries({
          queryKey: orpc.rider.getLastBeepToRate.queryKey(),
        });
        back();
      },
      onError(error) {
        alert(error.message);
      },
    }),
  );

  const onSubmit = () => {
    rate({
      userId: id,
      beepId,
      message: message,
      stars: stars,
    });
  };

  if (!user) {
    return <ActivityIndicator />;
  }

  return (
    <KeyboardAwareScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: 16, gap: 16 }}
    >
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
        />
      </View>
      <Button onPress={onSubmit} isDisabled={stars < 1} isLoading={isPending}>
        Rate User
      </Button>
    </KeyboardAwareScrollView>
  );
}
