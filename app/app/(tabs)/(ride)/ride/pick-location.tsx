import { useLocation } from "@/utils/location";
import { useTRPC } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
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

  const [query, setQuery] = useState("");

  const { data } = useQuery(
    trpc.location.getSuggestions.queryOptions({
      query,
      location: location?.coords,
    }),
  );

  return (
    <SafeAreaView>
      <KeyboardAvoidingView
        // behavior="height"
        // keyboardVerticalOffset={32}
        className="px-4 gap-4"
      >
        <SearchField value={query} onChange={setQuery}>
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input autoFocus />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>
        <FlatList
          data={data ?? []}
          ItemSeparatorComponent={<Separator className="my-2" />}
          renderItem={({ item }) => {
            const addressParts = [
              item.properties.housenumber,
              item.properties.street,
              item.properties.city,
              item.properties.state,
            ];

            const address = addressParts
              .filter((part) => part !== undefined)
              .join(" ");

            const value = item.properties.name ?? address;

            return (
              <PressableFeedback
                onPress={() => {
                  field.field.onChange(value);
                  router.back();
                }}
              >
                <Text>{item.properties.name}</Text>
                <Text color="subtle">{address}</Text>
              </PressableFeedback>
            );
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
