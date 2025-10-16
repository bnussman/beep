import { Label } from "@/components/Label";
import { Text } from "@/components/Text";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { RateLastBeeper } from "./RateLastBeeper";
import { BeepersMap } from "./BeepersMap";
import { Button } from "@/components/Button";
import { useNavigation } from "@react-navigation/native";
import { Input } from "@/components/Input";
import { LocationInput } from "@/components/LocationInput";

interface Props {
  groupSize?: string;
  origin?: string;
  destination?: string;
}

export function RiderForm(props: Props) {
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm({
    defaultValues: {
      groupSize: "",
      origin: props.origin ?? "",
      destination: props.destination ?? "",
    },
    values: {
      groupSize: props.groupSize ?? "",
      origin: props.origin ?? "",
      destination: props.destination ?? "",
    },
  });

  const findBeep = handleSubmit((values) => {
    navigation.navigate("Choose Beeper", values);
  });

  return (
    <KeyboardAwareScrollView
      scrollEnabled={false}
      contentContainerStyle={{ padding: 16, gap: 12 }}
    >
      <View style={{ gap: 4 }}>
        <Label htmlFor="groupSize">Group Size</Label>
        <Controller
          name="groupSize"
          rules={{
            required: "Group size is required",
            min: { value: 1, message: "Too small" },
            max: { value: 100, message: "Too large" },
            pattern: { value: /\d+/, message: "Must be a number" },
          }}
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              id="groupSize"
              inputMode="numeric"
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              ref={ref}
              returnKeyLabel="next"
              returnKeyType="next"
              onSubmitEditing={() => setFocus("origin")}
            />
          )}
        />
        <Text color="error">{errors.groupSize?.message}</Text>
        <Text color="error">{errors.groupSize?.root?.message}</Text>
      </View>
      <View style={{ gap: 4 }}>
        <Label htmlFor="origin">Pick Up Location</Label>
        <Controller
          name="origin"
          rules={{ required: "Pick up location is required" }}
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <LocationInput
              id="origin"
              onBlur={onBlur}
              onChangeText={(val) => onChange(val)}
              value={value}
              inputRef={ref}
              returnKeyLabel="next"
              returnKeyType="next"
              onSubmitEditing={() => setFocus("destination")}
            />
          )}
        />
        <Text color="error">{errors.origin?.message}</Text>
      </View>
      <View style={{ gap: 4 }}>
        <Label htmlFor="destination">Destination Location</Label>
        <Controller
          name="destination"
          rules={{ required: "Destination location is required" }}
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              id="destination"
              onBlur={onBlur}
              onChangeText={(val) => onChange(val)}
              value={value}
              ref={ref}
              returnKeyType="go"
              onSubmitEditing={() => findBeep()}
              textContentType="fullStreetAddress"
            />
          )}
        />
        <Text color="error">{errors.destination?.message}</Text>
      </View>
      <Button onPress={() => findBeep()}>Find Beep</Button>
      <BeepersMap />
      <RateLastBeeper />
    </KeyboardAwareScrollView>
  );
}
