import React from "react";
import * as ImagePicker from "expo-image-picker";
import { Container } from "../../components/Container";
import { useNavigation } from "@react-navigation/native";
import { Navigation } from "../../utils/Navigation";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { CreateCarMutation, CreateCarMutationVariables, Scalars } from "../../generated/graphql";
import { isMobile } from "../../utils/constants";
import { generateRNFile } from "../settings/EditProfile";
import { CarsQuery } from "./Cars";
import { capitalize, colors, years, makes, getModels } from "./utils";
import { Ionicons } from "@expo/vector-icons";
import {
  isValidationError,
  useValidationErrors,
} from "../../utils/useValidationErrors";
import {
  Image,
  CheckIcon,
  Select,
  Stack,
  Button,
  Flex,
  Pressable,
  Icon,
} from "native-base";

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

let picture: Scalars["Upload"];

export function AddCar() {
  const navigation = useNavigation<Navigation>();

  const { handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm();

  const photo = watch("photo");
  const make = watch("make");

  const [addCar, { error }] = useMutation<CreateCarMutation>(AddCarMutation);

  const validationErrors = useValidationErrors<CreateCarMutationVariables>(error);

  const choosePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      allowsEditing: true,
      aspect: [5, 3],
      base64: false,
    });

    if (result.cancelled) {
      return;
    }

    setValue("photo", result);

    if (!isMobile) {
      const res = await fetch(result.uri);
      const blob = await res.blob();
      const fileType = blob.type.split("/")[1];
      const file = new File([blob], "photo." + fileType);
      picture = file;
    } else {
      const file = generateRNFile(result.uri, "file.jpg");
      picture = file;
    }
  };

  const onSubmit = handleSubmit(async (variables) => {
    try {
      await addCar({
        variables: { ...variables, year: Number(variables.year), photo: picture },
        refetchQueries: [CarsQuery],
      })

      navigation.goBack();
    }
    catch (error)  {
      if (!isValidationError(error as ApolloError)) {
        alert((error as ApolloError).message);
      }
    }
  });

  return (
    <Container p={4}>
      <Stack space={4}>
        <Select
          accessibilityLabel="Choose Make"
          placeholder="Make"
          onValueChange={(value) => setValue("make", value)}
          _selectedItem={{
            bg: "teal.600",
            endIcon: <CheckIcon size="5" />,
          }}
        >
          {makes.map((make) => (
            <Select.Item key={make} label={make} value={make} />
          ))}
        </Select>
        <Select
          accessibilityLabel="Choose Model"
          placeholder="Model"
          onValueChange={(value) => setValue("model", value)}
          _selectedItem={{
            bg: "teal.600",
            endIcon: <CheckIcon size="5" />,
          }}
        >

          {!make ? [] : getModels(make).map((make) => (
            <Select.Item key={make} label={make} value={make} />
          ))}
        </Select>
        <Select
          accessibilityLabel="Choose Year"
          placeholder="Year"
          onValueChange={(value) => setValue("year", value)}
          _selectedItem={{
            bg: "teal.600",
            endIcon: <CheckIcon size="5" />,
          }}
        >
          {years.map((year) => (
            <Select.Item key={year} label={year} value={year} />
          ))}
        </Select>
        <Select
          accessibilityLabel="Choose Color"
          placeholder="Color"
          onValueChange={(value) => setValue("color", value)}
          _selectedItem={{
            bg: "teal.600",
            endIcon: <CheckIcon size="5" />,
          }}
        >
          {colors.map((color) => (
            <Select.Item key={color} label={capitalize(color)} value={color} />
          ))}
        </Select>
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
            <Flex
              height="48"
              bgColor="gray.100"
              borderRadius="2xl"
              alignItems="center"
              justifyContent="center"
              _text={{ fontWeight: "extrabold" }}
              _dark={{ bgColor: "gray.800" }}
            >
              Attach a Photo
              <Icon
                mt={2}
                as={Ionicons}
                name="ios-add-sharp"
                size="xl"
                color="black"
                _dark={{ color: "white" }}
              />
            </Flex>
          )}
        </Pressable>
        <Button
          _text={{ fontWeight: "extrabold" }}
          isLoading={isSubmitting}
          onPress={onSubmit}
        >
          Add Car
        </Button>
      </Stack>
    </Container>
  );
}
