import React from "react";
import { Marker as _Marker } from "react-map-gl/maplibre";
import { QueuePreview } from "./QueuePreview";
import { Avatar, Popover, Separator, Tooltip, Typography } from "@heroui/react";
import { Link } from "./Link";

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

  if (variant === "queue") {
    return (
      <Popover>
        <_Marker longitude={longitude} latitude={latitude}>
          <Popover.Trigger className="flex flex-col items-center">
            <Avatar className="size-8">
              <Avatar.Image alt={name} src={photo ?? undefined} />
              <Avatar.Fallback>{name.split(" ").map((part) => part.at(0)?.toUpperCase())}</Avatar.Fallback>
            </Avatar>
            <Typography type="body">{name}</Typography>
          </Popover.Trigger>
        </_Marker>
        <Popover.Content placement="right" className="max-w-sm">
          <Popover.Dialog className="flex flex-col gap-2 p-3">
            <Link to="/admin/users/$userId/queue" params={{ userId }}>
              <div className="flex items-center gap-2">
                <Avatar>
                  <Avatar.Image alt={name} src={photo ?? undefined} />
                  <Avatar.Fallback>{name.split(" ").map((part) => part.at(0)?.toUpperCase())}</Avatar.Fallback>
                </Avatar>
                <Typography type="body" className="font-bold">{name}</Typography>
              </div>
            </Link>
            <Separator />
            <QueuePreview userId={userId} />
            <Separator />
            <Typography type="body">
              {latitude.toFixed(3)} {longitude.toFixed(3)}
            </Typography>
          </Popover.Dialog>
        </Popover.Content>
      </Popover>
    );
  }

  return (
    <_Marker latitude={latitude} longitude={longitude}>
      <Tooltip>
        <Tooltip.Trigger className="flex flex-col items-center">
          <Avatar className="size-8">
            <Avatar.Image alt={name} src={photo ?? undefined} />
            <Avatar.Fallback>{name.split(" ").map((part) => part.at(0)?.toUpperCase())}</Avatar.Fallback>
          </Avatar>
          <Typography type="body">{name}</Typography>
        </Tooltip.Trigger>
        <Tooltip.Content showArrow>
          {latitude}, {longitude}
        </Tooltip.Content>
      </Tooltip>
    </_Marker>
  );
}
