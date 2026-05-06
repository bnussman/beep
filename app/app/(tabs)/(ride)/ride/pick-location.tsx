import { useLocation } from "@/utils/location";
import { useTRPC } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { PressableFeedback, SearchField } from "heroui-native";
import { useState } from "react";
import { FlatList, SafeAreaView, View } from "react-native";
import { Text } from "@/components/Text";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function PickLocation() {
  const params = useLocalSearchParams<{ type: "origin" | "destination" }>();
  const trpc = useTRPC();
  const router = useRouter();

  const { location } = useLocation(true);

  const [query, setQuery] = useState("");

  const { data } = useQuery(
    trpc.location.getSuggestions.queryOptions({
      query,
      location: location?.coords,
    }),
  );

  return (
    <SafeAreaView>
      <View className="px-4 gap-4">
        <SearchField value={query} onChange={setQuery}>
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input autoFocus />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>
        <FlatList
          data={data ?? []}
          contentContainerClassName="gap-2"
          renderItem={({ item }) => (
            <PressableFeedback
              onPress={() =>
                router.navigate({
                  pathname: "/ride",
                  params: {
                    ...params,
                    type: undefined,
                    [params.type]: item.properties.name,
                  },
                })
              }
            >
              <Text>{item.properties.name}</Text>
              <Text color="subtle">
                {item.properties.housenumber} {item.properties.street}{" "}
                {item.properties.city} {item.properties.state}
              </Text>
            </PressableFeedback>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
