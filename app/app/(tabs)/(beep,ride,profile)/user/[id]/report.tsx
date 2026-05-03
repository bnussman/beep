import React, { useState } from "react";
import { SafeAreaView, View } from "react-native";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { UserHeader } from "@/components/UserHeader";
import { useNavigation } from "@react-navigation/native";
import { useTRPC } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { Label } from "@/components/Label";
import { useLocalSearchParams } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export default function ReportScreen() {
  const trpc = useTRPC();
  const { id, beepId, ratingId } = useLocalSearchParams<{
    id: string;
    beepId: string;
    ratingId: string;
  }>();
  const [reason, setReason] = useState<string>("");
  const { goBack } = useNavigation();

  const { data: user } = useQuery(trpc.user.publicUser.queryOptions(id));

  const { mutateAsync: report, isPending } = useMutation(
    trpc.report.createReport.mutationOptions({
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
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        {user && (
          <UserHeader
            name={`${user.first} ${user.last}`}
            picture={user.photo}
          />
        )}
        <View style={{ gap: 4 }}>
          <Label>Reason</Label>
          <Input
            multiline
            numberOfLines={4}
            placeholder="Your reason for reporting here"
            style={{ minHeight: 150 }}
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
