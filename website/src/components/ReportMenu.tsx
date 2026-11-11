import React from "react";
import { DotsThreeOutlineIcon } from "@phosphor-icons/react";
import { Button, Dropdown, Label } from "@heroui/react";
import { createLink } from "@tanstack/react-router";

const RouterMenuItem = createLink(Dropdown.Item);

interface Props {
  reportId: string;
  onDelete: () => void;
}

export function ReportMenu(props: Props) {
  return (
    <Dropdown>
      <Button isIconOnly variant="ghost" aria-label="Report actions">
        <DotsThreeOutlineIcon className="size-4" weight="fill" />
      </Button>
      <Dropdown.Popover>
        <Dropdown.Menu>
          <RouterMenuItem
            id="details"
            textValue="Details"
            to="/admin/reports/$reportId"
            params={{ reportId: props.reportId }}
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
