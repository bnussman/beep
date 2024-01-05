import React, { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Input, Button, Spinner, Stack } from "tamagui";
import { GetUserProfileQuery, ReportUserMutation } from "../../generated/graphql";
import { Container } from "../../components/Container";
import { UserHeader } from "../../components/UserHeader";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { GetUser } from "./Profile";

const ReportUser = gql`
  mutation ReportUser($userId: String!, $reason: String!, $beepId: String) {
    reportUser(input: { userId: $userId, reason: $reason, beepId: $beepId })
  }
`;


type Props = StaticScreenProps<{ userId: string, beepId?: string }>;

export function ReportScreen({ route }: Props) {
  const [reason, setReason] = useState<string>();
  const [report, { loading }] = useMutation<ReportUserMutation>(ReportUser);
  const { goBack } = useNavigation();

  const { data } = useQuery<GetUserProfileQuery>(GetUser, {
    variables: {
      id: route.params.userId
    }
  });

  const user = data?.getUser;

  async function reportUser() {
    try {
      await report({
        variables: {
          userId: route.params.userId,
          beepId: route.params.beepId,
          reason: reason,
        },
      });
      goBack();
    } catch (error) {
      alert(error);
    }
  }

  return (
    <Container keyboard p="$4">
      <Stack space="$2" w="full">
        {user && (
          <UserHeader
            username={user.username}
            name={user.name}
            picture={user.photo}
          />
        )}
        <Input
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
          disabled={!reason}
          iconAfter={loading ? <Spinner /> : undefined}
        >
          Report User
        </Button>
      </Stack>
    </Container>
  );
}
