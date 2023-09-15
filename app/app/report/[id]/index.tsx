
import React, { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { GetUserProfileQuery, ReportUserMutation } from "../../../generated/graphql";
import { Input, Button, Stack } from "native-base";
import { Container } from "../../../components/Container";
import { UserHeader } from "../../../components/UserHeader";
import { router, useLocalSearchParams } from "expo-router";
import { GetUser } from "../../user/[id]";

const ReportUser = gql`
  mutation ReportUser($userId: String!, $reason: String!, $beepId: String) {
    reportUser(input: { userId: $userId, reason: $reason, beepId: $beepId })
  }
`;

export default function ReportScreen() {
  const [reason, setReason] = useState<string>();
  const [report, { loading }] = useMutation<ReportUserMutation>(ReportUser);
  const params = useLocalSearchParams();

  const { data } = useQuery<GetUserProfileQuery>(GetUser, {
    variables: { id: params.id },
  });

  const user = data?.getUser;

  async function reportUser() {
    try {
      await report({
        variables: {
          userId: params.id,
          beepId: params.beep,
          reason: reason,
        },
      });
      router.back();
    } catch (error) {
      alert(error);
    }
  }

  return (
    <Container keyboard p={4}>
      <Stack space={4} w="full">
        <UserHeader
          username={user?.username ?? ""}
          name={user?.name ?? ""}
          picture={user?.photo ?? ""}
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
