import { useInfiniteQuery } from "@tanstack/react-query";
import { Card } from "../components/Card";
import { Container } from "../components/Container";
import { openURL } from "expo-linking";
import { RefreshControl } from "react-native";
import {
  Avatar,
  Center,
  FlatList,
  Heading,
  HStack,
  Spinner,
  Stack,
  Text,
  useColorMode,
} from "native-base";

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
  const { colorMode } = useColorMode();
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isRefetching,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery<Commit[]>({
    queryFn: async ({ pageParam }) => {
      const response = await fetch(
        `https://api.github.com/repos/bnussman/beep/commits?sha=production&page=${
          pageParam ?? 1
        }`
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

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <Center>
          <Spinner mt={4} mb={9} color="gray.400" />
        </Center>
      );
    }
    return null;
  };

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
        keyExtractor={(item) => item.sha}
        onEndReached={hasNextPage ? () => fetchNextPage() : undefined}
        ListFooterComponent={renderFooter()}
        onEndReachedThreshold={0.1}
        renderItem={({ item }) => (
          <Card mt={2} mx={1} pressable onPress={() => openURL(item.html_url)}>
            <HStack space={2} mb={2} alignItems="center">
              <Avatar source={{ uri: item.committer.avatar_url }} />
              <Stack>
                <Heading
                  fontSize="xl"
                  fontWeight="extrabold"
                  letterSpacing="sm"
                >
                  {item.commit.committer.name}
                </Heading>
                <Text color="gray.400">
                  {new Date(item.commit.committer.date).toLocaleString()}
                </Text>
              </Stack>
            </HStack>
            <Text>{item.commit.message}</Text>
          </Card>
        )}
        refreshControl={
          <RefreshControl
            tintColor={colorMode === "dark" ? "#cfcfcf" : undefined}
            refreshing={isRefetching}
            onRefresh={refetch}
          />
        }
      />
    </Container>
  );
}
