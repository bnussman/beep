import React from "react";
import { DotsThreeVertical } from "@phosphor-icons/react";
import { Button, Dropdown, Label } from "@heroui/react";
import { createLink } from "@tanstack/react-router";

const RouterMenuItem = createLink(Dropdown.Item);

interface Props {
  onDelete?: () => void;
  beepId: string;
}

export function BeepMenu(props: Props) {
  const { onDelete, beepId } = props;

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <Button isIconOnly variant="tertiary" aria-label="Beep actions">
          <DotsThreeVertical size={20} />
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Popover>
        <Dropdown.Menu>
          <RouterMenuItem
            id="details"
            textValue="Details"
            to="/admin/beeps/$beepId"
            params={{ beepId }}
          >
            <Label>Details</Label>
          </RouterMenuItem>
          {onDelete && (
            <Dropdown.Item id="delete" textValue="Delete" variant="danger" onAction={onDelete}>
              <Label>Delete</Label>
            </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
