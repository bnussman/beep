import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { ReportUserMutation } from "../../generated/graphql";
import { Navigation } from "../../utils/Navigation";
import { Input, Button, Stack } from "native-base";
import { LocalWrapper } from "../../components/Container";

interface Props {
  route: any;
  navigation: Navigation;
}

const ReportUser = gql`
  mutation ReportUser($userId: String!, $reason: String!, $beepId: String) {
    reportUser(input: { userId: $userId, reason: $reason, beepId: $beepId })
  }
`;

export function ReportScreen(props: Props): JSX.Element {
  const [reason, setReason] = useState<string>();
  const [report, { loading }] = useMutation<ReportUserMutation>(ReportUser);

  async function reportUser() {
    try {
      await report({
        variables: {
          userId: props.route.params.id,
          beepId: props.route.params.beep,
          reason: reason,
        },
      });
      props.navigation.goBack();
    } catch (error) {
      alert(error);
    }
  }

  return (
    <LocalWrapper alignItems="center">
      <Stack space={4} w="90%" mt={4}>
        <Input
          placeholder="User"
          value={props.route.params.name}
          isDisabled={true}
        />
        <Input
          h={180}
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
    </LocalWrapper>
  );
}
