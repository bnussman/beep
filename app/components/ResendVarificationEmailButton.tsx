import React from "react";
import { Button } from "native-base";
import { gql, useMutation } from "@apollo/client";
import { ResendMutation } from "../generated/graphql";

const Resend = gql`
  mutation Resend {
    resendEmailVarification
  }
`;

function ResendButton() {
  const [resend, { data, loading, error }] =
    useMutation<ResendMutation>(Resend);

  async function resendEmailVarification() {
    const result = await resend();
    if (result) alert("Successfuly resent varification email");
    else alert(error?.message);
  }

  return (
    <Button isLoading={loading} onPress={() => resendEmailVarification()}>
      Resend Varification Email
    </Button>
  );
}

export default ResendButton;
