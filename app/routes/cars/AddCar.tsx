import React from "react";
import * as ImagePicker from "expo-image-picker";
import * as DropdownMenu from "zeego/dropdown-menu";
import { useNavigation } from "@react-navigation/native";
import { ApolloError, useMutation } from "@apollo/client";
import { useForm, Controller } from "react-hook-form";
import { isMobile } from "@/utils/constants";
import { Label } from "@/components/Label";
import { Input } from "@/components/Input";
import { Image } from "@/components/Image";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { generateRNFile } from "../settings/EditProfile";
import { CarsQuery } from "./Cars";
import { getMakes, getModels } from "car-info";
import { colors, years } from "./utils";
import { VariablesOf, graphql } from "../../graphql";
import { Pressable, View } from "react-native";
import {
  isValidationError,
  useValidationErrors,
} from "../../utils/useValidationErrors";

const makes = getMakes();

const AddCarMutation = graphql(`
  mutation CreateCar(
    $make: String!
    $model: String!
    $year: Float!
    $color: String!
    $photo: File!
  ) {
    createCar(
      make: $make
      model: $model
      year: $year
      color: $color
      photo: $photo
    ) {
      id
      make
      model
      year
      color
    }
  }
`);

let picture: any;

type Values = VariablesOf<typeof AddCarMutation>;

export function AddCar() {
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<Values>();

  const photo: any = watch("photo");
  const make = watch("make");

  const [addCar, { error, loading }] = useMutation(AddCarMutation, {
    context: {
      headers: {
        "apollo-require-preflight": true,
      },
    },
  });

  const validationErrors = useValidationErrors<Values>(error);

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
    try {
      await addCar({
        variables: {
          ...variables,
          year: Number(variables.year),
          photo: picture,
        },
        refetchQueries: [CarsQuery],
      });

      navigation.goBack();
    } catch (error) {
      if (!isValidationError(error as ApolloError)) {
        alert((error as ApolloError).message);
      }
    }
  });

  return (
    <View className="p-3">
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
              {getModels(make).map((make) => (
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
              {years.map((make) => (
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
          <Pressable onPress={choosePhoto} className="mt-4">
            {photo ? (
              <Image
                className="rounded-lg h-48 w-full"
                source={{ uri: photo.uri }}
                alt="uploaded car image"
              />
            ) : (
              <View className="rounded-lg h-48 w-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800">
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
        className="my-4"
        isLoading={isSubmitting}
        onPress={onSubmit}
        disabled={isSubmitting}
      >
        Add Car
      </Button>
    </View>
  );
}
