import React from "react";
import { Container } from "../../components/Container";
import { useNavigation } from "@react-navigation/native";
import { Navigation } from "../../utils/Navigation";
import { gql, useMutation } from "@apollo/client";
import { Text, CheckIcon, HStack, Select, Spacer, Stack, Heading, Button } from "native-base";
import { Avatar } from "../../components/Avatar";

const AddCarMutation = gql`
  mutation CreateCar(
    $make: String!
    $model: String!
    $year: Float!
    $color: String!
  ) {
    createCar(make: $make, model: $model, year: $year, color: $color) {
      id
      make
      model
      year
      color
    }
  }
`;

export function AddCar() {
  const navigation = useNavigation<Navigation>();

  const [addCar] = useMutation(AddCarMutation);

  return (
    <Container p={4}>
      <Stack space={4}>
        <Select
          accessibilityLabel="Choose Make"
          placeholder="Make"
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
          _selectedItem={{
            bg: "teal.600",
            endIcon: <CheckIcon size="5" />,
          }}
        >
          <Select.Item label="Toyota" value="toyota" />
          <Select.Item label="Honda" value="honda" />
        </Select>
        <Select
          accessibilityLabel="Choose Year"
          placeholder="Year"
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
          _selectedItem={{
            bg: "teal.600",
            endIcon: <CheckIcon size="5" />,
          }}
        >
          <Select.Item label="Blue" value="blue" />
          <Select.Item label="Red" value="red" />
        </Select>
        <HStack alignItems="center">
          <Stack>
            <Heading fontWeight="extrabold" letterSpacing="sm">
              Photo of Car
            </Heading>
            <Text>Please add a photo of your vehicle</Text>
          </Stack>
          <Spacer />
          <Avatar url={undefined} size="xl" />
        </HStack>
      </Stack>
      <Spacer />
      <Button>Add Car</Button>
    </Container>
  );
}
