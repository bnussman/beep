import React from "react";
import { Marker as _Marker } from 'mapkit-react';

interface Props {
  latitude: number;
  longitude: number;
  username: string;
  name: string;
}

export function Marker(props: Props) {
  const { latitude, longitude, name, username } = props;


  return (
    <_Marker title={name} subtitle={username} longitude={longitude} latitude={latitude} />
  );
};