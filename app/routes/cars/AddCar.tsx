import React from "react";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller, useWatch } from "react-hook-form";
import { Label } from "@/components/Label";
import { Input } from "@/components/Input";
import { Image } from "@/components/Image";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { getMakes, getModels } from "car-info";
import { colors, years } from "./utils";
import { Pressable, View } from "react-native";
import { useTRPC } from "@/utils/trpc";
import { useTheme } from "@/utils/theme";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { getFile } from "@/utils/files";
import { Menu } from "@/components/Menu";

const makes = getMakes();

interface Values {
  year: number;
  make: string;
  model: string;
  color: string;
  photo: ImagePicker.ImagePickerAsset;
}

export function AddCar() {
  const trpc = useTRPC();
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<Values>();

  const theme = useTheme();

  const [photo, make] = useWatch({ control, name: ["photo", "make"] });
  const models = getModels(make);

  const queryClient = useQueryClient();
  const { mutateAsync: addCar, error } = useMutation(
    trpc.car.createCar.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries(trpc.car.cars.pathFilter());
        navigation.goBack();
      },
      onError(error) {
        alert(error.message);
      },
    }),
  );

  const validationErrors = error?.data?.fieldErrors;

  const choosePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
      <Controller
        name="make"
        rules={{ required: "Make is required" }}
        defaultValue=""
        control={control}
        render={({ field: { onChange, value } }) => (
          <Menu
            trigger={
              <View style={{ gap: 4 }}>
                <Label>Make</Label>
                <Input readOnly value={value} placeholder="Select a make" />
                <Text color="error">
                  {errors.make?.message}
                  {validationErrors?.make?.[0]}
                </Text>
              </View>
            }
            options={makes.map((make) => ({
              title: make,
              onClick: () => onChange(make),
            }))}
          />
        )}
      />

      <Controller
        name="model"
        rules={{ required: "Model is required" }}
        defaultValue=""
        control={control}
        render={({ field: { onChange, value } }) => (
          <Menu
            trigger={
              <View style={{ gap: 4 }}>
                <Label>Model</Label>
                <Input readOnly value={value} placeholder="Select a model" />
                <Text color="error">
                  {errors.model?.message}
                  {validationErrors?.model?.[0]}
                </Text>
              </View>
            }
            options={models.map((model) => ({
              title: model,
              onClick: () => onChange(model),
            }))}
          />
        )}
      />

      <Controller
        name="year"
        rules={{ required: "Year is required" }}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Menu
            trigger={
              <View style={{ gap: 4 }}>
                <Label>Year</Label>
                <Input
                  readOnly
                  value={value ? String(value) : ""}
                  placeholder="Select a year"
                />

                <Text color="error">
                  {errors.year?.message}
                  {validationErrors?.year?.[0]}
                </Text>
              </View>
            }
            options={years.map((year) => ({
              title: year,
              onClick: () => onChange(year),
            }))}
          />
        )}
      />

      <Controller
        name="color"
        rules={{ required: "Color is required" }}
        defaultValue=""
        control={control}
        render={({ field: { onChange, value } }) => (
          <Menu
            trigger={
              <View style={{ gap: 4 }}>
                <Label>Color</Label>
                <Input
                  readOnly
                  value={value ? String(value) : ""}
                  placeholder="Select a color"
                />
                <Text color="error">
                  {errors.color?.message}
                  {validationErrors?.color?.[0]}
                </Text>
              </View>
            }
            options={colors.map((color) => ({
              title: color,
              onClick: () => onChange(color),
            }))}
          />
        )}
      />

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
        <Text color="error">
          {errors.photo?.message as string}
          {validationErrors?.photo?.[0]}
        </Text>
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
