import React from "react";
import { CarIcon, DotsThreeOutlineIcon, TrashIcon } from "@phosphor-icons/react";
import { Button, Dropdown, Label, toast } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { orpc } from "../utils/orpc";

interface Props {
  carId: string;
  onDelete: () => void;
}

export function CarMenu(props: Props) {
  const { carId, onDelete } = props;

  const { mutate: updateCar } = useMutation(
    orpc.car.updateCar.mutationOptions({
      onSuccess(data, variables, result, context) {
        context.client.invalidateQueries({
          queryKey: orpc.car.cars.key()
        });
        toast.success("Sucessfully made car default for user");
      },
      onError(error) {
        toast.danger(error.message);
      },
    }),
  );

  return (
    <Dropdown>
      <Button isIconOnly variant="ghost" aria-label="Car actions">
        <DotsThreeOutlineIcon className="size-4" weight="fill" />
      </Button>
      <Dropdown.Popover>
        <Dropdown.Menu>
          <Dropdown.Item
            id="make-default"
            textValue="Make Default"
            onAction={() => updateCar({ carId, data: { default: true } })}
          >
            <CarIcon className="size-4" />
            <Label>Make Default</Label>
          </Dropdown.Item>
          <Dropdown.Item id="delete" textValue="Delete" variant="danger" onAction={onDelete}>
            <TrashIcon className="size-4 text-danger" />
            <Label>Delete</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
