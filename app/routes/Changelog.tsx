import { useQuery } from "@tanstack/react-query";
import { Box, Divider, FlatList, Spinner } from "native-base";
import { Container } from "../components/Container";

export interface Author {
  name: string;
  email: string;
  date: Date;
}

export interface Committer {
  name: string;
  email: string;
  date: Date;
}

export interface Tree {
  sha: string;
  url: string;
}

export interface Verification {
  verified: boolean;
  reason: string;
  signature: string;
  payload: string;
}

export interface CommitDetails {
  author: Author;
  committer: Committer;
  message: string;
  tree: Tree;
  url: string;
  comment_count: number;
  verification: Verification;
}

export interface Author2 {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export interface Committer2 {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export interface Parent {
  sha: string;
  url: string;
  html_url: string;
}

export interface Commit {
  sha: string;
  node_id: string;
  commit: CommitDetails;
  url: string;
  html_url: string;
  comments_url: string;
  author: Author2;
  committer: Committer2;
  parents: Parent[];
}

export function Changelog() {
  const { data, isLoading, error } = useQuery<Commit[]>({
    queryFn: async () => {
      const response = await fetch(
        "https://api.github.com/repos/bnussman/beep/commits"
      );
      return await response.json();
    },
    queryKey: ["github"],
  });

  if (isLoading) {
    return (
      <Container center>
        <Spinner />
      </Container>
    );
  }

  if (error) {
    return <Container center>Unable to get changelog</Container>;
  }

  return (
    <Container>
      <FlatList
        data={data}
        ItemSeparatorComponent={Divider}
        renderItem={({ item }) => <Box p={2}>{item.commit.message}</Box>}
      />
    </Container>
  );
}
