import React from "react";
import * as ImagePicker from "expo-image-picker";
import { Container } from "../../components/Container";
import { useNavigation } from "@react-navigation/native";
import { Navigation } from "../../utils/Navigation";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { useForm, Controller } from "react-hook-form";
import {
  CreateCarMutation,
  CreateCarMutationVariables,
} from "../../generated/graphql";
import { isMobile } from "../../utils/constants";
import { generateRNFile } from "../settings/EditProfile";
import { CarsQuery } from "./Cars";
import { getMakes, getModels } from "car-info";
import { capitalize, colors, years } from "./utils";
import { Ionicons } from "@expo/vector-icons";
import {
  isValidationError,
  useValidationErrors,
} from "../../utils/useValidationErrors";
import {
  Image,
  Select,
  Stack,
  Text,
  Button,
} from "tamagui";
import { Pressable } from "react-native";

const makes = getMakes();

const AddCarMutation = gql`
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
`;

let picture: CreateCarMutationVariables["photo"];

export function AddCar() {
  const navigation = useNavigation<Navigation>();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm();

  const photo = watch("photo");
  const make = watch("make");

  const [addCar, { error, loading }] = useMutation<CreateCarMutation>(
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
    useValidationErrors<CreateCarMutationVariables>(error);

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
    <Container p={4}>
      <Stack space={4}>
          <Controller
            name="make"
            rules={{ required: "Make is required" }}
            defaultValue=""
            control={control}
            render={({ field: { onChange } }) => (
              <Select
                accessibilityLabel="Choose Make"
                placeholder="Make"
                onValueChange={(value) => onChange(value)}
                _selectedItem={{
                  bg: "teal.600",
                }}
              >
                {makes.map((make) => (
                  <Select.Item key={make} label={make} value={make} />
                ))}
              </Select>
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
            render={({ field: { onChange } }) => (
              <Select
                accessibilityLabel="Choose Model"
                placeholder="Model"
                onValueChange={(value) => onChange(value)}
                _selectedItem={{
                  bg: "teal.600",
                }}
              >
                {!make
                  ? []
                  : getModels(make).map((make: string) => (
                      <Select.Item key={make} label={make} value={make} />
                    ))}
              </Select>
            )}
          />
          <Text>
            {errors.model?.message}
            {validationErrors?.model?.[0]}
          </Text>
          <Controller
            name="year"
            rules={{ required: "Year is required" }}
            defaultValue=""
            control={control}
            render={({ field: { onChange } }) => (
              <Select
                accessibilityLabel="Choose Year"
                placeholder="Year"
                onValueChange={(value) => onChange(value)}
                _selectedItem={{
                  bg: "teal.600",
                }}
              >
                {years.map((year) => (
                  <Select.Item key={year} label={year} value={year} />
                ))}
              </Select>
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
                accessibilityLabel="Choose Color"
                placeholder="Color"
                onValueChange={(value) => onChange(value)}
                _selectedItem={{
                  bg: "teal.600",
                }}
              >
                {colors.map((color) => (
                  <Select.Item
                    key={color}
                    label={capitalize(color)}
                    value={color}
                  />
                ))}
              </Select>
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
                    borderRadius="2xl"
                    source={{ uri: photo.uri }}
                    alt="uploaded car image"
                  />
                ) : (
                  <Stack
                    height="48"
                    bgColor="gray.100"
                    borderRadius="2xl"
                    alignItems="center"
                    justifyContent="center"
                    _text={{ fontWeight: "extrabold" }}
                    _dark={{ bgColor: "gray.800" }}
                  >
                    <Text>Attach a Photo</Text>
                    <Ionicons
                      mt={2}
                      name="ios-add-sharp"
                      size="xl"
                      color="black"
                      _dark={{ color: "white" }}
                    />
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
          _text={{ fontWeight: "extrabold" }}
          isLoading={isSubmitting || loading}
          onPress={onSubmit}
        >
          Add Car
        </Button>
      </Stack>
    </Container>
  );
}
