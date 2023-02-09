import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Divider, FlatList, Pressable, Spinner, Text } from "native-base";
import { Container } from "../components/Container";
import { openURL } from "expo-linking";
import { useRef, useState } from "react";

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
  const ref = useRef(1);
  const { data, isLoading, error, fetchNextPage, hasNextPage } =
    useInfiniteQuery<Commit[]>({
      queryFn: async () => {
        const response = await fetch(
          `https://api.github.com/repos/bnussman/beep/commits?sha=production&page=${ref.current}`
        );
        return await response.json();
      },
      getNextPageParam: (lastPage, pages) => {
        if (lastPage[lastPage.length - 1].parents.length > 0) {
          return pages.length + 1;
        }
        return null;
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
        data={data?.pages.flatMap((page) => page)}
        ItemSeparatorComponent={Divider}
        keyExtractor={(item) => item.sha}
        onEndReached={hasNextPage ? () => fetchNextPage() : undefined}
        renderItem={({ item }) => (
          <Pressable onPress={() => openURL(item.html_url)} p={2}>
            <Text>{item.commit.message}</Text>
          </Pressable>
        )}
      />
    </Container>
  );
}
