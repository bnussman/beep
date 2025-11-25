import React from "react";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller, useWatch } from "react-hook-form";
import { Label } from "@/components/Label";
import { Input } from "@/components/Input";
import { Image } from "@/components/Image";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { years } from "./utils";
import { Pressable, View } from "react-native";
import { useTRPC } from "@/utils/trpc";
import { useTheme } from "@/utils/theme";
import { skipToken, useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { getFile } from "@/utils/files";
import { Menu } from "@/components/Menu";

interface Values {
  year: number;
  make: string;
  model: string;
  color: string;
  photo: ImagePicker.ImagePickerAsset;
}

export function AddCar() {
  const trpc = useTRPC();
  const theme = useTheme();
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { isSubmitting, errors },
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

  const { mutateAsync: addCar } = useMutation(
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

    await addCar(formData).catch();
  });

  return (
    <View style={{ padding: 16, gap: 8 }}>
      <View style={{ gap: 4 }}>
        <Label htmlFor="make">Make</Label>
        <Controller
          name="make"
          rules={{ required: "Make is required" }}
          defaultValue=""
          control={control}
          render={({ field, fieldState }) => (
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
          )}
        />
        <Text color="error">{errors.make?.message}</Text>
      </View>
      <View style={{ gap: 4 }}>
        <Label htmlFor="model">Model</Label>
        <Controller
          name="model"
          rules={{ required: "Model is required" }}
          defaultValue=""
          control={control}
          render={({ field }) => (
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
          )}
        />

        <Text color="error">{errors.model?.message}</Text>
      </View>
      <View style={{ gap: 4 }}>
        <Label htmlFor="year">Year</Label>
        <Controller
          name="year"
          rules={{ required: "Year is required" }}
          control={control}
          render={({ field }) => (
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
          )}
        />

        <Text color="error">{errors.year?.message}</Text>
      </View>
      <View style={{ gap: 4 }}>
        <Label htmlFor="color">Color</Label>
        <Controller
          name="color"
          rules={{ required: "Color is required" }}
          defaultValue=""
          control={control}
          render={({ field }) => (
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
          )}
        />
        <Text color="error">{errors.color?.message}</Text>
      </View>
      <View style={{ gap: 4 }}>
        <Controller
          name="photo"
          rules={{ required: "Photo is required" }}
          control={control}
          render={() => (
            <Pressable onPress={choosePhoto}>
              {photo ? (
                <Image
                  style={{ borderRadius: 12, height: 192, width: "100%" }}
                  source={{ uri: photo.uri }}
                  alt="uploaded car image"
                />
              ) : (
                <View
                  style={{
                    backgroundColor: theme.components.card.backgroundColor,
                    borderColor: theme.components.card.borderColor,
                    borderWidth: 1,
                    borderRadius: 12,
                    height: 192,
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text weight="bold">Attach a Photo</Text>
                  <Text size="4xl">📷</Text>
                </View>
              )}
            </Pressable>
          )}
        />
        <Text color="error">{errors.photo?.message}</Text>
      </View>
      <Button
        isLoading={isSubmitting}
        onPress={onSubmit}
        disabled={isSubmitting}
      >
        Add Car
      </Button>
    </View>
  );
}
