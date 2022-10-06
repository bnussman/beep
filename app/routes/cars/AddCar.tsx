import React from "react";
import * as ImagePicker from "expo-image-picker";
import { Container } from "../../components/Container";
import { useNavigation } from "@react-navigation/native";
import { Navigation } from "../../utils/Navigation";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { CreateCarMutationVariables, Scalars } from "../../generated/graphql";
import { isMobile } from "../../utils/constants";
import { generateRNFile } from "../settings/EditProfile";
import {
  Image,
  CheckIcon,
  Select,
  Stack,
  Button,
  Flex,
  Pressable,
} from "native-base";
import { CarsQuery } from "./Cars";

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

  const { handleSubmit, setValue, watch } = useForm();

  const photo = watch("photo");

  const [addCar, { loading }] =
    useMutation<CreateCarMutationVariables>(AddCarMutation);

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
    addCar({
      variables: { ...variables, year: Number(variables.year), photo: picture },
      refetchQueries: [CarsQuery],
    })
      .then(() => {
        navigation.goBack();
      })
      .catch((error: ApolloError) => {
        alert(JSON.stringify(error));
      });
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
          <Select.Item label="Toyota" value="toyota" />
          <Select.Item label="Honda" value="honda" />
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
          <Select.Item label="Tundra" value="tundra" />
          <Select.Item label="Tacoma" value="tacoma" />
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
          <Select.Item label="2016" value="2016" />
          <Select.Item label="2022" value="2022" />
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
          <Select.Item label="Blue" value="blue" />
          <Select.Item label="Red" value="red" />
        </Select>
        <Pressable onPress={choosePhoto}>
          {photo ? (
            <Image
              height="48"
              width="100%"
              borderRadius="2xl"
              source={{ uri: photo.uri }}
            />
          ) : (
            <Flex
              height="48"
              bgColor="gray.800"
              borderRadius="2xl"
              alignItems="center"
              justifyContent="center"
              _text={{ fontWeight: "extrabold" }}
            >
              Click to attach a photo of your 🚙
            </Flex>
          )}
        </Pressable>
        <Button
          _text={{ fontWeight: "extrabold" }}
          isLoading={loading}
          onPress={onSubmit}
        >
          Add Car
        </Button>
      </Stack>
    </Container>
  );
}
