import React from "react";
import * as ImagePicker from "expo-image-picker";
import * as DropdownMenu from "zeego/dropdown-menu";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller, useWatch } from "react-hook-form";
import { isMobile } from "@/utils/constants";
import { Label } from "@/components/Label";
import { Input } from "@/components/Input";
import { Image } from "@/components/Image";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { generateRNFile } from "../settings/EditProfile";
import { getMakes, getModels } from "car-info";
import { colors, years } from "./utils";
import { Pressable, View } from "react-native";
import { trpc } from "@/utils/trpc";
import { TRPCClientError } from "@trpc/client";
import { useTheme } from "@/utils/theme";

const makes = getMakes();

let picture: any;

interface Values {
  year: number;
  make: string;
  model: string;
  color: string;
  photo: any;
};

export function AddCar() {
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<Values>();

  const theme = useTheme();

  const [photo, make] = useWatch({ control, name: ["photo", "make"] });
  const models = getModels(make)

  const utils = trpc.useUtils();
  const { mutateAsync: addCar, error } = trpc.car.createCar.useMutation();

  const validationErrors = error?.data?.zodError?.fieldErrors;

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

    if (!isMobile) {
      const res = await fetch(result.assets[0].uri);
      const blob = await res.blob();
      const fileType = blob.type.split("/")[1];
      const file = new File([blob], "photo." + fileType);
      picture = file;
    } else {
      const file = generateRNFile(result.assets[0].uri, "file.jpg");
      picture = file;
    }
  };

  const onSubmit = handleSubmit(async (variables) => {
    const formData = new FormData();

    for (const key in variables) {
      if (key === 'photo') {
        continue;
      }
      formData.append(key, variables[key as keyof typeof variables]);
    }

    formData.append("photo", picture);

    try {
      await addCar(formData);

      utils.car.invalidate();

      navigation.goBack();
    } catch (error) {
      alert((error as TRPCClientError<any>).message)
    }
  });

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Controller
        name="make"
        rules={{ required: "Make is required" }}
        defaultValue=""
        control={control}
        render={({ field: { onChange, value } }) => (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <View>
                <Label>Make</Label>
                <Input readOnly value={value} placeholder="Select a make" />
              </View>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              {makes.map((make) => (
                <DropdownMenu.Item key={make} onSelect={() => onChange(make)}>
                  <DropdownMenu.ItemTitle>{make}</DropdownMenu.ItemTitle>
                </DropdownMenu.Item>
              ))}
              <DropdownMenu.Separator />
              <DropdownMenu.Arrow />
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        )}
      />
      <Text color="error">
        {errors.make?.message}
        {validationErrors?.make?.[0]}
      </Text>
      <Controller
        name="model"
        rules={{ required: "Model is required" }}
        defaultValue=""
        control={control}
        render={({ field: { onChange, value } }) => (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <View>
                <Label>Model</Label>
                <Input readOnly value={value} placeholder="Select a model" />
              </View>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              {models.map((make) => (
                <DropdownMenu.Item key={make} onSelect={() => onChange(make)}>
                  <DropdownMenu.ItemTitle>{make}</DropdownMenu.ItemTitle>
                </DropdownMenu.Item>
              ))}
              <DropdownMenu.Separator />
              <DropdownMenu.Arrow />
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        )}
      />
      <Text color="error">
        {errors.model?.message}
        {validationErrors?.model?.[0]}
      </Text>
      <Controller
        name="year"
        rules={{ required: "Year is required" }}
        control={control}
        render={({ field: { onChange, value } }) => (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <View>
                <Label>Year</Label>
                <Input
                  readOnly
                  value={value ? String(value) : ""}
                  placeholder="Select a year"
                />
              </View>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              {years.map((year) => (
                <DropdownMenu.Item key={year} onSelect={() => onChange(year)}>
                  <DropdownMenu.ItemTitle>{year}</DropdownMenu.ItemTitle>
                </DropdownMenu.Item>
              ))}
              <DropdownMenu.Separator />
              <DropdownMenu.Arrow />
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        )}
      />
      <Text color="error">
        {errors.year?.message}
        {validationErrors?.year?.[0]}
      </Text>
      <Controller
        name="color"
        rules={{ required: "Color is required" }}
        defaultValue=""
        control={control}
        render={({ field: { onChange, value } }) => (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <View>
                <Label>Color</Label>
                <Input
                  readOnly
                  value={value ? String(value) : ""}
                  placeholder="Select a color"
                />
              </View>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              {colors.map((make) => (
                <DropdownMenu.Item key={make} onSelect={() => onChange(make)}>
                  <DropdownMenu.ItemTitle>{make}</DropdownMenu.ItemTitle>
                </DropdownMenu.Item>
              ))}
              <DropdownMenu.Separator />
              <DropdownMenu.Arrow />
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        )}
      />
      <Text color="error">
        {errors.color?.message}
        {validationErrors?.color?.[0]}
      </Text>
      <Controller
        name="photo"
        rules={{ required: "Photo is required" }}
        control={control}
        render={() => (
          <Pressable onPress={choosePhoto}>
            {photo ? (
              <Image
                style={{ borderRadius: 12, height: 192, width: '100%' }}
                source={{ uri: photo.uri }}
                alt="uploaded car image"
              />
            ) : (
              <View style={{ backgroundColor: theme.components.card.backgroundColor, borderColor: theme.components.card.borderColor, borderWidth: 1, borderRadius: 12, height: 192, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
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
