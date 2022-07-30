import React, { useMemo, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { ReportUserMutation } from "../../generated/graphql";
import { Navigation } from "../../utils/Navigation";
import { Input, Button, Stack } from "native-base";
import { Container } from "../../components/Container";
import { UserHeader } from "../../components/UserHeader";
import { useNavigation, useRoute } from "@react-navigation/native";

const ReportUser = gql`
  mutation ReportUser($userId: String!, $reason: String!, $beepId: String) {
    reportUser(input: { userId: $userId, reason: $reason, beepId: $beepId })
  }
`;

export function ReportScreen() {
  const [reason, setReason] = useState<string>();
  const [report, { loading }] = useMutation<ReportUserMutation>(ReportUser);
  const { params } = useRoute<any>();
  const { goBack } = useNavigation<Navigation>();

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
    <Container alignItems="center" keyboard>
      <Stack space={4} w="90%" mt={4}>
        {useMemo(
          () => (
            <UserHeader user={params.user} />
          ),
          []
        )}
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
