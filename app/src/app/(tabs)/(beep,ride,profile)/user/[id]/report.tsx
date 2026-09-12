import { useState } from "react";
import { SafeAreaView, View } from "react-native";
import { Input } from "@/components/Input";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { UserHeader } from "@/components/UserHeader";
import { useNavigation } from "expo-router/react-navigation";
import { skipToken, useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { Label } from "@/components/Label";
import { useLocalSearchParams } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { orpc } from "@/utils/orpc";

export default function ReportScreen() {
  const { id, beepId, ratingId } = useLocalSearchParams<{
    id: string;
    beepId?: string;
    ratingId?: string;
  }>();

  const [reason, setReason] = useState<string>("");

  const { goBack } = useNavigation();

  const { data: user } = useQuery(orpc.user.publicUser.queryOptions({ input: id }));

  const { data: rating } = useQuery(orpc.rating.rating.queryOptions({ input: ratingId ?? skipToken }));
  const { data: beep } = useQuery(orpc.beep.beep.queryOptions({ input: beepId ?? skipToken }));

  const { mutateAsync: report, isPending } = useMutation(
    orpc.report.createReport.mutationOptions({
      onSuccess() {
        goBack();
      },
      onError(error) {
        alert(error.message);
      },
    }),
  );

  const handleReport = () => {
    report({
      userId: id,
      beepId,
      ratingId,
      reason: reason,
    });
  };

  return (
    <SafeAreaView>
      <KeyboardAwareScrollView
        style={{ height: "100%" }}
        scrollEnabled={false}
        contentContainerStyle={{ padding: 16, gap: 8 }}
      >
        {user && (
          <UserHeader
            name={`${user.first} ${user.last}`}
            picture={user.photo}
          />
        )}
        <View className="my-2">
          {beep && (
            <Text>
              You are reporting {user?.first} for the beep from <Text weight="600">{beep.origin}</Text> to <Text weight="600">{beep.destination}</Text>{" "}
              that took place on <Text weight="600">{beep.start.toLocaleDateString()}</Text>.
            </Text>
          )}
          {rating && (
            <Text>
              You are reporting {user?.first} for their <Text weight="600">{rating.stars} star</Text> rating they gave you
              on <Text weight="600">{rating.timestamp.toLocaleDateString()}</Text>.
            </Text>
          )}
        </View>
        <View style={{ gap: 4 }}>
          <Label>Reason</Label>
          <Input
            multiline
            numberOfLines={4}
            placeholder="Your reason for reporting here"
            style={{ minHeight: 150, paddingVertical: 12 }}
            onChangeText={(text) => setReason(text)}
          />
        </View>
        <Button
          onPress={handleReport}
          isDisabled={!reason}
          isLoading={isPending}
        >
          Report User
        </Button>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
