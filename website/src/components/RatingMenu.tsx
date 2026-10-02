import React from "react";
import { DotsThreeVertical } from "@phosphor-icons/react";
import { Button, Dropdown, Label } from "@heroui/react";
import { createLink } from "@tanstack/react-router";

const RouterMenuItem = createLink(Dropdown.Item);

interface Props {
  ratingId: string;
  onDelete: () => void;
}

export function RatingMenu(props: Props) {
  return (
    <Dropdown>
      <Dropdown.Trigger>
        <Button isIconOnly variant="tertiary" aria-label="Rating actions">
          <DotsThreeVertical size={20} />
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Popover>
        <Dropdown.Menu>
          <RouterMenuItem
            id="details"
            textValue="Details"
            to="/admin/ratings/$ratingId"
            params={{ ratingId: props.ratingId }}
          >
            <Label>Details</Label>
          </RouterMenuItem>
          <Dropdown.Item id="delete" textValue="Delete" variant="danger" onAction={props.onDelete}>
            <Label>Delete</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
