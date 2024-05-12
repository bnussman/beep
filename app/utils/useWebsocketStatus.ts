import { useEffect, useState } from "react";
import { wsLink } from "./apollo";

export type WebsocketStatus = "Closed" | "Opened" | "Connecting" | "Connected";

export function useWebsocketStatus() {
  const [status, setStatus] = useState<WebsocketStatus>("Closed");

  useEffect(() => {
    wsLink.client.on("connected", () => {
      setStatus("Connected");
    });
    wsLink.client.on("connecting", () => {
      setStatus("Connecting");
    });
    wsLink.client.on("closed", () => {
      setStatus("Closed");
    });
    wsLink.client.on("opened", () => {
      setStatus("Opened");
    });
  }, []);

  return status;
}
