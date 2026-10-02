import React from "react";
import { Marker as _Marker } from "react-map-gl/maplibre";
import { Link as RouterLink } from "@tanstack/react-router";
import { QueuePreview } from "./QueuePreview";
import { Typography } from "@heroui/react";
import {
  Link,
  Avatar,
  Tooltip,
  Popover,
  Button,
  Divider,
} from "@mui/material";

interface Props {
  latitude: number;
  longitude: number;
  username: string;
  userId: string;
  photo: string | null | undefined;
  name: string;
  variant?: "queue" | "default";
}

export function Marker(props: Props) {
  const { latitude, longitude, variant, userId, username, photo, name } = props;

  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  if (variant === "queue") {
    return (
      <div>
        <_Marker longitude={longitude} latitude={latitude}>
          <div onClick={handleClick} className="flex flex-col items-center">
            <Avatar src={photo ?? undefined} sx={{ width: 32, height: 32 }} />
            <Typography>{name}</Typography>
          </div>
        </_Marker>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          slotProps={{
            paper: { sx: { p: 1 } },
          }}
        >
          <div className="flex flex-col gap-2">
            <Link component={RouterLink} to={`/admin/users/${userId}/queue`}>
              <div className="flex items-center gap-2">
                <Avatar src={photo || ""} />
                <Typography type="body" className="font-bold">{name}</Typography>
              </div>
            </Link>
            <Divider />
            <QueuePreview userId={userId} />
            <Divider />
            <Typography>
              {latitude.toFixed(3)} {longitude.toFixed(3)}
            </Typography>
          </div>
        </Popover>
      </div>
    );
  }

  return (
    <_Marker latitude={latitude} longitude={longitude}>
      <Tooltip title={`${latitude}, ${longitude}`} arrow>
        <div className="flex flex-col items-center">
          <Avatar src={photo ?? undefined} sx={{ width: 32, height: 32 }} />
          <Typography>{name}</Typography>
        </div>
      </Tooltip>
    </_Marker>
  );
}
