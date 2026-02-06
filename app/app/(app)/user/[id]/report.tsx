import React, { useState } from "react";
import { View } from "react-native";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { UserHeader } from "@/components/UserHeader";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { useTRPC } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { Label } from "@/components/Label";

type Props = StaticScreenProps<{ userId: string; beepId?: string }>;

export default function ReportScreen({ route }: Props) {
  const trpc = useTRPC();
  const [reason, setReason] = useState<string>("");
  const { goBack } = useNavigation();

  const { data: user } = useQuery(
    trpc.user.publicUser.queryOptions(route.params.userId),
  );

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
      userId: route.params.userId,
      beepId: route.params.beepId,
      reason: reason,
    });
  };

  return (
    <View style={{ padding: 16, gap: 8 }}>
      {user && (
        <UserHeader
          username={user.username}
          name={`${user.first} ${user.last}`}
          picture={user.photo}
        />
      )}
      <View style={{ gap: 4 }}>
        <Label>Reason</Label>
        <Input
          multiline
          numberOfLines={4}
          autoFocus
          placeholder="Your reason for reporting here"
          style={{ minHeight: 150 }}
          onChangeText={(text) => setReason(text)}
        />
      </View>
      <Button onPress={handleReport} disabled={!reason} isLoading={isPending}>
        Report User
      </Button>
    </View>
  );
}
