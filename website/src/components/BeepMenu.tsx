import React from "react";
import { DotsThreeOutlineIcon } from "@phosphor-icons/react";
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
      <Button isIconOnly variant="ghost" aria-label="Beep actions">
        <DotsThreeOutlineIcon className="size-4" weight="fill" />
      </Button>
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
