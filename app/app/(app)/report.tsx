import React, { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { GetUserProfileQuery, ReportUserMutation } from "../../generated/graphql";
import { Input, Button, Stack } from "native-base";
import { Container } from "../../components/Container";
import { UserHeader } from "../../components/UserHeader";
import { GetUser } from "./profile";
import { router, useLocalSearchParams } from "expo-router";

const ReportUser = gql`
  mutation ReportUser($userId: String!, $reason: String!, $beepId: String) {
    reportUser(input: { userId: $userId, reason: $reason, beepId: $beepId })
  }
`;

export default function ReportScreen() {
  const [reason, setReason] = useState<string>();
  const [report, { loading }] = useMutation<ReportUserMutation>(ReportUser);
  const params = useLocalSearchParams<{ userId: string, beepId: string }>();

  const { data } = useQuery<GetUserProfileQuery>(GetUser, {
    variables: {
      id: params.userId
    }
  });

  const user = data?.getUser;

  async function reportUser() {
    try {
      await report({
        variables: {
          userId: params.userId,
          beepId: params.beepId,
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
        {user &&
          <UserHeader
            username={user.username}
            name={user.name}
            picture={user.photo}
          />
        }
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
