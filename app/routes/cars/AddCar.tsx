import React, { useMemo } from "react";
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
import { colors, years } from "./utils";
import {
  isValidationError,
  useValidationErrors,
} from "../../utils/useValidationErrors";
import {
  Image,
  Select,
  Stack,
  Button,
  Adapt,
  Spinner,
  Sheet,
  YStack,
  SizableText,
  Label,
} from "tamagui";
import { Pressable } from "react-native";
import { Check, ChevronDown, ChevronUp, Plus } from "@tamagui/lucide-icons";
import { LinearGradient } from "tamagui/linear-gradient";

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
  const make: string = watch("make", "");

  const [addCar, { error, loading }] = useMutation<CreateCarMutation>(
    AddCarMutation,
    {
      context: {
        headers: {
          "apollo-require-preflight": true,
        },
      },
    },
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
    <Container p="$4">
      <Stack space={4}>
        <Label htmlFor="make">Make</Label>
        <Controller
          name="make"
          rules={{ required: "Make is required" }}
          defaultValue=""
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select
              id="make"
              value={value}
              onValueChange={onChange}
              disablePreventBodyScroll
              native
            >
              <Select.Trigger width="100%" iconAfter={ChevronDown}>
                <Select.Value placeholder="Make" />
              </Select.Trigger>
              <Adapt when="sm" platform="touch">
                <Sheet
                  native
                  modal
                  dismissOnSnapToBottom
                  animationConfig={{
                    type: "spring",
                    damping: 20,
                    mass: 1.2,
                    stiffness: 250,
                  }}
                >
                  <Sheet.Frame>
                    <Sheet.ScrollView>
                      <Adapt.Contents />
                    </Sheet.ScrollView>
                  </Sheet.Frame>
                  <Sheet.Overlay
                    animation="lazy"
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                  />
                </Sheet>
              </Adapt>

              <Select.Content zIndex={200000}>
                <Select.ScrollUpButton
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                  width="100%"
                  height="$3"
                >
                  <YStack zIndex={10}>
                    <ChevronUp size={20} />
                  </YStack>
                  <LinearGradient
                    start={[0, 0]}
                    end={[0, 1]}
                    fullscreen
                    colors={["$background", "transparent"]}
                    borderRadius="$4"
                  />
                </Select.ScrollUpButton>

                <Select.Viewport
                  // to do animations:
                  // animation="quick"
                  // animateOnly={['transform', 'opacity']}
                  // enterStyle={{ o: 0, y: -10 }}
                  // exitStyle={{ o: 0, y: 10 }}
                  minWidth={200}
                >
                  <Select.Group>
                    <Select.Label>Make</Select.Label>
                    <Select.Item index={0} value="" disabled>
                      <Select.ItemText>Select a Make</Select.ItemText>
                    </Select.Item>
                    {/* for longer lists memoizing these is useful */}
                    {useMemo(
                      () =>
                        makes.map((make, i) => {
                          return (
                            <Select.Item index={i + 1} key={make} value={make}>
                              <Select.ItemText>{make}</Select.ItemText>
                              <Select.ItemIndicator marginLeft="auto">
                                <Check size={16} />
                              </Select.ItemIndicator>
                            </Select.Item>
                          );
                        }),
                      [makes],
                    )}
                  </Select.Group>
                  {/* Native gets an extra icon */}
                  <YStack
                    position="absolute"
                    right={0}
                    top={0}
                    bottom={0}
                    alignItems="center"
                    justifyContent="center"
                    width={"$4"}
                    pointerEvents="none"
                  >
                    <ChevronDown size="$2" />
                  </YStack>
                </Select.Viewport>

                <Select.ScrollDownButton
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                  width="100%"
                  height="$3"
                >
                  <YStack zIndex={10}>
                    <ChevronDown size={20} />
                  </YStack>
                  <LinearGradient
                    start={[0, 0]}
                    end={[0, 1]}
                    fullscreen
                    colors={["transparent", "$background"]}
                    borderRadius="$4"
                  />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select>
          )}
        />
        <SizableText>
          {errors.make?.message}
          {validationErrors?.make?.[0]}
        </SizableText>
        <Label htmlFor="model">Model</Label>
        <Controller
          name="model"
          rules={{ required: "Model is required" }}
          defaultValue=""
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select
              id="model"
              value={value}
              onValueChange={onChange}
              disablePreventBodyScroll
              native
            >
              <Select.Trigger width="100%" iconAfter={ChevronDown}>
                <Select.Value placeholder="Model" />
              </Select.Trigger>
              <Adapt when="sm" platform="touch">
                <Sheet
                  native
                  modal
                  dismissOnSnapToBottom
                  animationConfig={{
                    type: "spring",
                    damping: 20,
                    mass: 1.2,
                    stiffness: 250,
                  }}
                >
                  <Sheet.Frame>
                    <Sheet.ScrollView>
                      <Adapt.Contents />
                    </Sheet.ScrollView>
                  </Sheet.Frame>
                  <Sheet.Overlay
                    animation="lazy"
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                  />
                </Sheet>
              </Adapt>

              <Select.Content zIndex={200000}>
                <Select.ScrollUpButton
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                  width="100%"
                  height="$3"
                >
                  <YStack zIndex={10}>
                    <ChevronUp size={20} />
                  </YStack>
                  <LinearGradient
                    start={[0, 0]}
                    end={[0, 1]}
                    fullscreen
                    colors={["$background", "transparent"]}
                    borderRadius="$4"
                  />
                </Select.ScrollUpButton>

                <Select.Viewport
                  // to do animations:
                  // animation="quick"
                  // animateOnly={['transform', 'opacity']}
                  // enterStyle={{ o: 0, y: -10 }}
                  // exitStyle={{ o: 0, y: 10 }}
                  minWidth={200}
                >
                  <Select.Group>
                    <Select.Label>Model</Select.Label>
                    {/* for longer lists memoizing these is useful */}
                    {getModels(make)?.map((model, i) => (
                      <Select.Item index={i} key={model} value={model}>
                        <Select.ItemText>{model}</Select.ItemText>
                        <Select.ItemIndicator marginLeft="auto">
                          <Check size={16} />
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.Group>
                  {/* Native gets an extra icon */}
                  <YStack
                    position="absolute"
                    right={0}
                    top={0}
                    bottom={0}
                    alignItems="center"
                    justifyContent="center"
                    width={"$4"}
                    pointerEvents="none"
                  >
                    <ChevronDown size="$2" />
                  </YStack>
                </Select.Viewport>

                <Select.ScrollDownButton
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                  width="100%"
                  height="$3"
                >
                  <YStack zIndex={10}>
                    <ChevronDown size={20} />
                  </YStack>
                  <LinearGradient
                    start={[0, 0]}
                    end={[0, 1]}
                    fullscreen
                    colors={["transparent", "$background"]}
                    borderRadius="$4"
                  />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select>
          )}
        />
        <SizableText>
          {errors.model?.message}
          {validationErrors?.model?.[0]}
        </SizableText>
        <Label htmlFor="year">Year</Label>
        <Controller
          name="year"
          rules={{ required: "Year is required" }}
          defaultValue=""
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select
              id="year"
              value={value}
              onValueChange={onChange}
              disablePreventBodyScroll
              native
            >
              <Select.Trigger width="100%" iconAfter={ChevronDown}>
                <Select.Value placeholder="Year" />
              </Select.Trigger>
              <Adapt when="sm" platform="touch">
                <Sheet
                  native
                  modal
                  dismissOnSnapToBottom
                  animationConfig={{
                    type: "spring",
                    damping: 20,
                    mass: 1.2,
                    stiffness: 250,
                  }}
                >
                  <Sheet.Frame>
                    <Sheet.ScrollView>
                      <Adapt.Contents />
                    </Sheet.ScrollView>
                  </Sheet.Frame>
                  <Sheet.Overlay
                    animation="lazy"
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                  />
                </Sheet>
              </Adapt>

              <Select.Content zIndex={200000}>
                <Select.ScrollUpButton
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                  width="100%"
                  height="$3"
                >
                  <YStack zIndex={10}>
                    <ChevronUp size={20} />
                  </YStack>
                  <LinearGradient
                    start={[0, 0]}
                    end={[0, 1]}
                    fullscreen
                    colors={["$background", "transparent"]}
                    borderRadius="$4"
                  />
                </Select.ScrollUpButton>

                <Select.Viewport
                  // to do animations:
                  // animation="quick"
                  // animateOnly={['transform', 'opacity']}
                  // enterStyle={{ o: 0, y: -10 }}
                  // exitStyle={{ o: 0, y: 10 }}
                  minWidth={200}
                >
                  <Select.Group>
                    <Select.Label>Year</Select.Label>
                    {useMemo(
                      () =>
                        years.map((year, i) => {
                          return (
                            <Select.Item index={i} key={year} value={year}>
                              <Select.ItemText>{year}</Select.ItemText>
                              <Select.ItemIndicator marginLeft="auto">
                                <Check size={16} />
                              </Select.ItemIndicator>
                            </Select.Item>
                          );
                        }),
                      [years],
                    )}
                  </Select.Group>
                  {/* Native gets an extra icon */}
                  <YStack
                    position="absolute"
                    right={0}
                    top={0}
                    bottom={0}
                    alignItems="center"
                    justifyContent="center"
                    width={"$4"}
                    pointerEvents="none"
                  >
                    <ChevronDown size="$2" />
                  </YStack>
                </Select.Viewport>

                <Select.ScrollDownButton
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                  width="100%"
                  height="$3"
                >
                  <YStack zIndex={10}>
                    <ChevronDown size={20} />
                  </YStack>
                  <LinearGradient
                    start={[0, 0]}
                    end={[0, 1]}
                    fullscreen
                    colors={["transparent", "$background"]}
                    borderRadius="$4"
                  />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select>
          )}
        />
        <SizableText>
          {errors.year?.message}
          {validationErrors?.year?.[0]}
        </SizableText>
        <Label htmlFor="color">Color</Label>
        <Controller
          name="color"
          rules={{ required: "Color is required" }}
          defaultValue=""
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select
              id="color"
              value={value}
              onValueChange={onChange}
              disablePreventBodyScroll
              native
            >
              <Select.Trigger width="100%" iconAfter={ChevronDown}>
                <Select.Value placeholder="Color" />
              </Select.Trigger>
              <Adapt when="sm" platform="touch">
                <Sheet
                  native
                  modal
                  dismissOnSnapToBottom
                  animationConfig={{
                    type: "spring",
                    damping: 20,
                    mass: 1.2,
                    stiffness: 250,
                  }}
                >
                  <Sheet.Frame>
                    <Sheet.ScrollView>
                      <Adapt.Contents />
                    </Sheet.ScrollView>
                  </Sheet.Frame>
                  <Sheet.Overlay
                    animation="lazy"
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                  />
                </Sheet>
              </Adapt>

              <Select.Content zIndex={200000}>
                <Select.ScrollUpButton
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                  width="100%"
                  height="$3"
                >
                  <YStack zIndex={10}>
                    <ChevronUp size={20} />
                  </YStack>
                  <LinearGradient
                    start={[0, 0]}
                    end={[0, 1]}
                    fullscreen
                    colors={["$background", "transparent"]}
                    borderRadius="$4"
                  />
                </Select.ScrollUpButton>

                <Select.Viewport
                  // to do animations:
                  // animation="quick"
                  // animateOnly={['transform', 'opacity']}
                  // enterStyle={{ o: 0, y: -10 }}
                  // exitStyle={{ o: 0, y: 10 }}
                  minWidth={200}
                >
                  <Select.Group>
                    <Select.Label>Colors</Select.Label>
                    {useMemo(
                      () =>
                        colors.map((color, i) => {
                          return (
                            <Select.Item index={i} key={color} value={color}>
                              <Select.ItemText>{color}</Select.ItemText>
                              <Select.ItemIndicator marginLeft="auto">
                                <Check size={16} />
                              </Select.ItemIndicator>
                            </Select.Item>
                          );
                        }),
                      [colors],
                    )}
                  </Select.Group>
                  {/* Native gets an extra icon */}
                  <YStack
                    position="absolute"
                    right={0}
                    top={0}
                    bottom={0}
                    alignItems="center"
                    justifyContent="center"
                    width={"$4"}
                    pointerEvents="none"
                  >
                    <ChevronDown size="$2" />
                  </YStack>
                </Select.Viewport>

                <Select.ScrollDownButton
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                  width="100%"
                  height="$3"
                >
                  <YStack zIndex={10}>
                    <ChevronDown size={20} />
                  </YStack>
                  <LinearGradient
                    start={[0, 0]}
                    end={[0, 1]}
                    fullscreen
                    colors={["transparent", "$background"]}
                    borderRadius="$4"
                  />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select>
          )}
        />
        <SizableText>
          {errors.color?.message}
          {validationErrors?.color?.[0]}
        </SizableText>
        <Controller
          name="photo"
          rules={{ required: "Photo is required" }}
          defaultValue=""
          control={control}
          render={() => (
            <Pressable onPress={choosePhoto}>
              {photo ? (
                <Image
                  height="$14"
                  width="100%"
                  borderRadius="$4"
                  source={{ uri: photo.uri }}
                  alt="uploaded car image"
                />
              ) : (
                <Stack
                  height="$14"
                  bg="$gray3"
                  borderRadius="$4"
                  alignItems="center"
                  justifyContent="center"
                >
                  <SizableText mb="$2">Attach a Photo</SizableText>
                  <Plus size={24} />
                </Stack>
              )}
            </Pressable>
          )}
        />
        <SizableText>
          {errors.photo?.message}
          {validationErrors?.photo?.[0]}
        </SizableText>
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
