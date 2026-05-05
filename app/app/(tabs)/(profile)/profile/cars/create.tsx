import React from "react";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller, useWatch } from "react-hook-form";
import { Label } from "@/components/Label";
import { Input } from "@/components/Input";
import { Image } from "@/components/Image";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { years } from "@/utils/cars";
import { Pressable } from "react-native";
import { useTRPC } from "@/utils/trpc";
import { skipToken, useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { getFile } from "@/utils/files";
import { Menu } from "@/components/Menu";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { Card, FieldError, TextField } from "heroui-native";

interface Values {
  year: number;
  make: string;
  model: string;
  color: string;
  photo: ImagePicker.ImagePickerAsset;
}

export default function AddCar() {
  const trpc = useTRPC();
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { isSubmitting },
  } = useForm<Values>();

  const [photo, make] = useWatch({ control, name: ["photo", "make"] });

  const { data: colors } = useQuery({
    ...trpc.car.getColors.queryOptions(),
    initialData: [],
  });

  const { data: models } = useQuery({
    ...trpc.car.getModels.queryOptions(make ? make : skipToken),
    initialData: [],
  });

  const { data: makes } = useQuery({
    ...trpc.car.getMakes.queryOptions(),
    initialData: [],
  });

  const queryClient = useQueryClient();

  const { mutate: addCar } = useMutation(
    trpc.car.createCar.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries(trpc.car.cars.pathFilter());
        navigation.goBack();
      },
      onError(error) {
        if (error.data?.fieldErrors) {
          for (const key in error.data.fieldErrors) {
            setError(key as keyof Values, {
              message: error.data.fieldErrors[key][0],
            });
          }
        } else {
          alert(error.message);
        }
      },
    }),
  );

  const choosePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: false,
      allowsEditing: true,
      aspect: [5, 3],
      base64: false,
    });

    if (result.canceled) {
      return;
    }

    setValue("photo", result.assets[0]);
  };

  const onSubmit = handleSubmit(async (variables) => {
    const formData = new FormData();

    for (const key in variables) {
      if (key === "photo") {
        formData.append("photo", (await getFile(variables[key])) as Blob);
      } else {
        formData.append(
          key,
          variables[key as keyof typeof variables] as string,
        );
      }
    }

    addCar(formData);
  });

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ padding: 16, gap: 8 }}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Controller
        name="make"
        rules={{ required: "Make is required" }}
        defaultValue=""
        control={control}
        render={({ field, fieldState }) => (
          <TextField isInvalid={!!fieldState.error}>
            <Label htmlFor="make">Make</Label>
            <Menu
              trigger={
                <Input
                  id="make"
                  readOnly
                  value={field.value}
                  placeholder="Select a make"
                />
              }
              options={makes.map((make) => ({
                title: make,
                onClick: () => field.onChange(make),
              }))}
            />
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />
      <Controller
        name="model"
        rules={{ required: "Model is required" }}
        defaultValue=""
        control={control}
        render={({ field, fieldState }) => (
          <TextField isInvalid={!!fieldState.error}>
            <Label htmlFor="model">Model</Label>
            <Menu
              disabled={!make}
              trigger={
                <Input
                  id="model"
                  readOnly
                  value={field.value}
                  placeholder="Select a model"
                />
              }
              options={models!.map((model) => ({
                title: model,
                onClick: () => field.onChange(model),
              }))}
            />
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />
      <Controller
        name="year"
        rules={{ required: "Year is required" }}
        control={control}
        render={({ field, fieldState }) => (
          <TextField isInvalid={!!fieldState.error}>
            <Label htmlFor="year">Year</Label>
            <Menu
              trigger={
                <Input
                  id="year"
                  readOnly
                  value={field.value ? String(field.value) : ""}
                  placeholder="Select a year"
                />
              }
              options={years.map((year) => ({
                title: String(year),
                onClick: () => field.onChange(year),
              }))}
            />
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />
      <Controller
        name="color"
        rules={{ required: "Color is required" }}
        defaultValue=""
        control={control}
        render={({ field, fieldState }) => (
          <TextField isInvalid={!!fieldState.error}>
            <Label htmlFor="color">Color</Label>
            <Menu
              trigger={
                <Input
                  id="color"
                  readOnly
                  value={field.value ? String(field.value) : ""}
                  placeholder="Select a color"
                />
              }
              options={colors.map((color) => ({
                title: color,
                onClick: () => field.onChange(color),
              }))}
            />
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />
      <Controller
        name="photo"
        rules={{ required: "Photo is required" }}
        control={control}
        render={({ fieldState }) => (
          <TextField isInvalid={!!fieldState.error}>
            <Pressable
              onPress={choosePhoto}
              style={({ pressed }) => (pressed ? { opacity: 0.8 } : {})}
            >
              {photo ? (
                <Image
                  style={{ borderRadius: 12, height: 192, width: "100%" }}
                  source={{ uri: photo.uri }}
                  alt="uploaded car image"
                />
              ) : (
                <Card className="flex items-center min-h-48 justify-center">
                  <Text weight="bold">Attach a Photo</Text>
                  <Text size="4xl">📷</Text>
                </Card>
              )}
            </Pressable>
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />
      <Button
        isLoading={isSubmitting}
        onPress={onSubmit}
        isDisabled={isSubmitting}
      >
        Add Car
      </Button>
    </KeyboardAwareScrollView>
  );
}
