import React from "react";
import { DotsThreeVerticalIcon } from "@phosphor-icons/react";
import { Button, Dropdown, Label, toast } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { orpc } from "../utils/orpc";

interface Props {
  carId: string;
  onDelete: () => void;
}

export function CarMenu(props: Props) {
  const { carId, onDelete } = props;

  const queryClient = useQueryClient();

  const { mutateAsync: updateCar } = useMutation(
    orpc.car.updateCar.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: orpc.car.cars.key()
        });
        toast.success("Sucessfully made car default for user", { timeout: 5_000 });
      },
      onError(error) {
        toast.danger(error.message, { timeout: 5_000 });
      },
    }),
  );

  return (
    <Dropdown>
      <Button isIconOnly variant="tertiary" aria-label="Car actions">
        <DotsThreeVerticalIcon size={20} />
      </Button>
      <Dropdown.Popover>
        <Dropdown.Menu>
          <Dropdown.Item
            id="make-default"
            textValue="Make Default"
            onAction={() => { void updateCar({ carId, data: { default: true } }); }}
          >
            <Label>Make Default</Label>
          </Dropdown.Item>
          <Dropdown.Item id="delete" textValue="Delete" variant="danger" onAction={onDelete}>
            <Label>Delete</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
