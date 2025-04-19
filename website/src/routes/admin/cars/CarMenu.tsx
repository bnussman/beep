import React from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { trpc } from "../../../utils/trpc";
import { useNotifications } from "@toolpad/core";

interface Props {
  carId: string;
  onDelete: () => void;
}

export function CarMenu(props: Props) {
  const { carId, onDelete } = props;

  const notifications = useNotifications();
  const utils = trpc.useUtils();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  const { mutateAsync: updateCar } = trpc.car.updateCar.useMutation({
    onSuccess() {
      utils.car.cars.invalidate();
      notifications.show("Sucessfully made car default for user", { severity: 'success' });
      handleClose();
    },
    onError(error) {
      notifications.show(error.message, { severity: 'error' });
    }
  });

  return (
    <>
      <IconButton
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": "basic-button",
          },
        }}
      >
        <MenuItem onClick={() => updateCar({ carId, data: { default: true } })}>
          Make Default
        </MenuItem>
        <MenuItem onClick={onDelete}>Delete</MenuItem>
      </Menu>
    </>
  );
}
