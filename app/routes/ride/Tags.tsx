import { User } from "../../generated/graphql";
import { Button, Layout } from "@ui-kitten/components";
import React from "react";
import { StyleSheet } from "react-native";

interface TagProps {
  status: string;
  children: any;
}

interface Props {
  user: Partial<User>;
}

export function Tag(props: TagProps): JSX.Element {
  const { status, children } = props;

  return (
    <Button
      status={status}
      size='tiny'
      style={styles.tag}
    >
      {children}
    </Button>
  );
}

export function Tags(props: Props): JSX.Element {
  const { user } = props;

  return (
    <Layout style={styles.tagRow}>
      {user.isStudent && <Tag status="basic">Student</Tag> }
      {user.masksRequired && <Tag status="info">Masks Required</Tag>}
      {user.role == "ADMIN" && <Tag status="danger">Founder</Tag>}
    </Layout>
  );
}

const styles = StyleSheet.create({
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
    width: "80%",
    justifyContent: "center"
  },
  tag: {
    margin: 4
  }
});