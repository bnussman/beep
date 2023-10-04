import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Beep, ReportUserMutation, User } from "../../generated/graphql";
import { Input, Button, Stack } from "native-base";
import { Container } from "../../components/Container";
import { UserHeader } from "../../components/UserHeader";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";

const ReportUser = gql`
  mutation ReportUser($userId: String!, $reason: String!, $beepId: String) {
    reportUser(input: { userId: $userId, reason: $reason, beepId: $beepId })
  }
`;

type Props = StaticScreenProps<{
  user: User;
  beep?: string;
}>;

export function ReportScreen({ route }: Props) {
  const params = route.params;
  const [reason, setReason] = useState<string>();
  const [report, { loading }] = useMutation<ReportUserMutation>(ReportUser);
  const { goBack } = useNavigation();

  async function reportUser() {
    try {
      await report({
        variables: {
          userId: params.user.id,
          beepId: params.beep,
          reason: reason,
        },
      });
      goBack();
    } catch (error) {
      alert(error);
    }
  }

  return (
    <Container keyboard p={4}>
      <Stack space={4} w="full">
        <UserHeader
          username={params.user.username}
          name={params.user.name}
          picture={params.user.photo ?? ""}
        />
        <Input
          size="lg"
          h={100}
          multiline={true}
          placeholder="Your reason for reporting here"
          returnKeyType="go"
          onChangeText={(text) => setReason(text)}
          onSubmitEditing={() => reportUser()}
          blurOnSubmit={true}
        />
        <Button
          onPress={() => reportUser()}
          isDisabled={!reason}
          isLoading={loading}
        >
          Report User
        </Button>
      </Stack>
    </Container>
  );
}
