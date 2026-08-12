import { useLocation } from "@/utils/location";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { PressableFeedback, SearchField } from "heroui-native";
import { useState } from "react";
import { FlatList, SafeAreaView, View } from "react-native";
import { Text } from "@/components/Text";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Separator } from "heroui-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useController } from "react-hook-form";
import { orpc } from "@/utils/orpc";

export default function PickLocation() {
  const params = useLocalSearchParams<{ type: "origin" | "destination" }>();
  const router = useRouter();

  const { location } = useLocation(true);

  const field = useController({ name: params.type, shouldUnregister: false });

  const [query, setQuery] = useState(field.field.value);

  const { data } = useQuery(
    orpc.location.getSuggestions.queryOptions({
      input: {
        query,
        location: location?.coords,
      },
      refetchOnMount: false,
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
    query && !data?.some((item) => query === (item.name ?? item.address))
      ? [placeholderOption, ...(data ?? [])]
      : data;

  return (
    <SafeAreaView>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={64}
        className="p-4 h-full gap-4"
      >
        <SearchField value={query} onChange={setQuery}>
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input
              autoFocus
              textContentType="fullStreetAddress"
              autoCorrect={false}
            />
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
