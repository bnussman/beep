import React, { useState } from "react";
import { View } from "react-native";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { UserHeader } from "@/components/UserHeader";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { trpc } from "@/utils/trpc";

type Props = StaticScreenProps<{ userId: string; beepId?: string }>;

export function ReportScreen({ route }: Props) {
  const [reason, setReason] = useState<string>("");
  const { goBack } = useNavigation();

  const { data: user } = trpc.user.user.useQuery(route.params.userId);
  const { mutateAsync: report, isPending } = trpc.report.createReport.useMutation({
    onSuccess() {
      goBack();
    },
    onError(error) {
      alert(error.message);
    }
  });

  const handleReport = () => {
    report({
      userId: route.params.userId,
      beepId: route.params.beepId,
      reason: reason,
    });
  }

  return (
    <View style={{ padding: 16, gap: 16 }}>
      {user && (
        <UserHeader
          username={user.username}
          name={`${user.first} ${user.last}`}
          picture={user.photo}
        />
      )}
      <Input
        multiline={true}
        numberOfLines={4}
        placeholder="Your reason for reporting here"
        returnKeyType="go"
        style={{ minHeight: 150 }}
        onChangeText={(text) => setReason(text)}
        onSubmitEditing={handleReport}
        blurOnSubmit={true}
      />
      <Button
        onPress={handleReport}
        disabled={!reason}
        isLoading={isPending}
      >
        Report User
      </Button>
    </View>
  );
}
