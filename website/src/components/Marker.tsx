import React from "react";
import { Marker as _Marker } from 'react-map-gl/mapbox';
import { Link } from "@tanstack/react-router";
import { QueuePreview } from "./QueuePreview";
import {
  Avatar,
  Typography,
  Stack,
  Tooltip,
  Popover,
  Button,
} from "@mui/material";

interface Props {
  latitude: number;
  longitude: number;
  username: string;
  userId: string;
  photo: string | null | undefined;
  name: string;
  variant?: 'queue' | 'default';
}

export function Marker(props: Props) {
  const { latitude, longitude, variant, userId, username, photo, name } = props;

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;


  if (variant === 'queue') {
    return (
      <div>
        <_Marker longitude={longitude} latitude={latitude}>
          <Button onClick={handleClick}>
            <Stack alignItems="center">
              <Avatar src={photo ?? undefined} sx={{ width: 32, height: 32 }} />
              <Typography>{name}</Typography>
            </Stack>
          </Button>
        </_Marker>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          slotProps={{
            paper: { sx: { p: 1 } }
          }}
        >
          <Link to="/admin/users/$userId/queue" params={{ userId }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Avatar src={photo || ''} />
              <Stack spacing={0}>
                <Typography fontWeight="extrabold">{name}</Typography>
                <Typography>@{username}</Typography>
              </Stack>
            </Stack>
          </Link>
          <QueuePreview userId={userId} />
          <Typography>{latitude.toFixed(3)} {longitude.toFixed(3)}</Typography>
        </Popover>
      </div>
    );
  }

  return (
    <_Marker latitude={latitude} longitude={longitude}>
      <Tooltip title={`${latitude}, ${longitude}`} arrow>
        <Stack alignItems="center">
          <Avatar src={photo ?? undefined} sx={{ width: 32, height: 32 }} />
          <Typography>{name}</Typography>
        </Stack>
      </Tooltip>
    </_Marker>
  );
};
