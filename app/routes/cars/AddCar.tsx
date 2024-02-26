import React from "react";
import * as ImagePicker from "expo-image-picker";
import { Container } from "../../components/Container";
import { useNavigation } from "@react-navigation/native";
import { ApolloError, useMutation } from "@apollo/client";
import { useForm, Controller } from "react-hook-form";
import { isMobile } from "../../utils/constants";
import { generateRNFile } from "../settings/EditProfile";
import { CarsQuery } from "./Cars";
import { getMakes, getModels } from "car-info";
import { capitalize, colors, years } from "./utils";
import { VariablesOf, graphql } from "gql.tada";
import {
  isValidationError,
  useValidationErrors,
} from "../../utils/useValidationErrors";
import {
  Image,
  Stack,
  Button,
  Text,
  Select,
  Spinner,
} from "@beep/ui";
import { Pressable } from "react-native";
import { Plus } from "@tamagui/lucide-icons";

const makes = getMakes();

const AddCarMutation = graphql(`
  mutation CreateCar(
    $make: String!
    $model: String!
    $year: Float!
    $color: String!
    $photo: Upload!
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

type Values = VariablesOf<typeof AddCarMutation>

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

  const [addCar, { error, loading }] = useMutation(
    AddCarMutation,
    {
      context: {
        headers: {
          "apollo-require-preflight": true,
        },
      },
    }
  );

  const validationErrors =
    useValidationErrors<Values>(error);

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
    <Container p="$4">
      <Stack gap="$4">
        <Controller
          name="make"
          rules={{ required: "Make is required" }}
          defaultValue=""
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select
              value={value}
              onValueChange={onChange}
              items={makes.map((make) => ({ label: make }))}
            />
          )}
        />
        <Text>
          {errors.make?.message}
          {validationErrors?.make?.[0]}
        </Text>
        <Controller
          name="model"
          rules={{ required: "Model is required" }}
          defaultValue=""
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select
              items={getModels(make).map(model => ({ label: model }))}
              onValueChange={onChange}
              value={value}
            />
          )}
        />
        <Text>
          {errors.model?.message}
          {validationErrors?.model?.[0]}
        </Text>
        <Controller
          name="year"
          rules={{ required: "Year is required" }}
          control={control}
          render={({ field: { onChange } }) => (
            <Select
              items={years.map(year => ({ label: year }))}
              onValueChange={onChange}
            />
          )}
        />
        <Text>
          {errors.year?.message}
          {validationErrors?.year?.[0]}
        </Text>
        <Controller
          name="color"
          rules={{ required: "Color is required" }}
          defaultValue=""
          control={control}
          render={({ field: { onChange } }) => (
            <Select
              items={colors.map(color => ({ label: color }))}
              onValueChange={onChange}
            />
          )}
        />
        <Text>
          {errors.color?.message}
          {validationErrors?.color?.[0]}
        </Text>
        <Controller
          name="photo"
          rules={{ required: "Photo is required" }}
          defaultValue=""
          control={control}
          render={() => (
            <Pressable onPress={choosePhoto}>
              {photo ? (
                <Image
                  height="48"
                  width="100%"
                  borderRadius="$4"
                  source={{ uri: photo.uri }}
                  alt="uploaded car image"
                />
              ) : (
                  <Stack
                    height={64}
                    bg="$gray8"
                    borderRadius="$4"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text>Attach a Photo</Text>
                    <Plus />
                  </Stack>
                )}
            </Pressable>
          )}
        />
        <Text>
          {errors.photo?.message}
          {validationErrors?.photo?.[0]}
        </Text>
        <Button
          iconAfter={isSubmitting || loading ? <Spinner /> : undefined}
          onPress={onSubmit}
        >
          Add Car
        </Button>
      </Stack>
    </Container>
  );
}
