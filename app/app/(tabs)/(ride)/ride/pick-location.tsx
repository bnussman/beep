import { useLocation } from "@/utils/location";
import { useTRPC } from "@/utils/trpc";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { PressableFeedback, SearchField } from "heroui-native";
import { useState } from "react";
import { FlatList, SafeAreaView, View } from "react-native";
import { Text } from "@/components/Text";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Separator } from "heroui-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useController } from "react-hook-form";

export default function PickLocation() {
  const params = useLocalSearchParams<{ type: "origin" | "destination" }>();
  const trpc = useTRPC();
  const router = useRouter();

  const { location } = useLocation(true);

  const field = useController({ name: params.type, shouldUnregister: false });

  const [query, setQuery] = useState(field.field.value);

  const { data, isFetching } = useQuery(
    trpc.location.getSuggestions.queryOptions(
      {
        query,
        location: location?.coords,
      },
      {
        placeholderData: keepPreviousData,
        select(data) {
          return data.map((item) => {
            const addressParts = [
              item.properties.housenumber,
              item.properties.street,
              item.properties.city,
              item.properties.state,
            ];

            const address = addressParts
              .filter((part) => part !== undefined)
              .join(" ");

            if (item.properties.name) {
              return {
                name: item.properties.name,
                address,
              };
            }

            return { address };
          });
        },
      },
    ),
  );

  const placeholderOption = { address: query, name: undefined };

  const options =
    query && query !== (data?.[0]?.name ?? data?.[0]?.address)
      ? [placeholderOption, ...(data ?? [])]
      : data;

  return (
    <SafeAreaView>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={48}
        className="px-4 gap-4"
      >
        <SearchField value={query} onChange={setQuery}>
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input autoFocus autoCorrect={false} />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>
        <FlatList
          data={options ?? []}
          ItemSeparatorComponent={<Separator />}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => {
            return (
              <PressableFeedback
                className="rounded-xl"
                onPress={() => {
                  field.field.onChange(item.name ?? item.address);
                  router.back();
                }}
              >
                <View className="p-4 px-2">
                  <PressableFeedback.Highlight />
                  {item.name ? (
                    <>
                      <Text>{item.name}</Text>
                      <Text color="subtle">{item.address}</Text>
                    </>
                  ) : (
                    <Text>{item.address}</Text>
                  )}
                </View>
              </PressableFeedback>
            );
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
