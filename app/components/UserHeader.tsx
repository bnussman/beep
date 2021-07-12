import React from "react";
import { Layout, Text } from "@ui-kitten/components";
import { User } from "../generated/graphql";
import ProfilePicture from "./ProfilePicture";

interface Props {
  user: User;
}

export function UserHeader(props: Props): JSX.Element {
  const { user } = props;

  return (
    <Layout style={{ flexDirection: 'row', marginHorizontal: -16 }}>
      {user.photoUrl &&
        <ProfilePicture
          style={{ marginHorizontal: 8 }}
          size={50}
          url={user.photoUrl}
        />
      }
      <Layout>
        <Text category='h4'>
          {props.user.name}
        </Text>
        <Text
          appearance='hint'
          category='s1'>
          @{props.user.username}
        </Text>
      </Layout>
    </Layout>
  );
}