import { importPKCS8, SignJWT } from "jose";
import http2 from "http2";
import { APPLE_APN_KEY, APPLE_APN_KEY_ID, APPLE_TEAM_ID } from "./constants.ts";

type ActivityUpdate =
  | {
      name: "RiderActivity";
      action: "update";
      props: {
        status: string;
        etaMinutes?: number;
        name: string;
        positionInQueue: number;
        car?: { make: string; model: string; color: string };
      };
      alert?: { title: string; body: string };
    }
  | {
      name: "RiderActivity";
      action: "end";
      props?: never;
      alert?: never;
    };

export async function updateLiveActivity(
  deviceToken: string,
  options: ActivityUpdate,
) {
  const devicePath = `/3/device/${deviceToken}`;

  if (!APPLE_APN_KEY || !APPLE_TEAM_ID) {
    throw new Error("Apple Keys not setup in the Beep API.");
  }

  const privateKey = await importPKCS8(APPLE_APN_KEY, "ES256");

  const token = await new SignJWT()
    .setIssuer(APPLE_TEAM_ID)
    .setIssuedAt()
    .setProtectedHeader({
      alg: "ES256",
      kid: APPLE_APN_KEY_ID,
    })
    .sign(privateKey);

  const body = {
    aps: {
      timestamp: Date.now(),
      event: options.action,
      "content-state":
        options.action === "update"
          ? {
              name: options.name,
              props: JSON.stringify(options.props),
            }
          : {},
      alert: options.alert,
      ...(options.action === "end"
        ? {
            "dismissal-date": Date.now() / 1000,
          }
        : {}),
      sound: "default",
    },
  };

  const client = http2.connect("https://api.push.apple.com");

  client.on("error", (err) => console.error(err));

  const headers = {
    ":method": "POST",
    "apns-push-type": "liveactivity",
    "apns-topic": "app.ridebeep.App.push-type.liveactivity",
    "apns-priority": 10,
    ":scheme": "https",
    ":path": devicePath,
    authorization: `bearer ${token}`,
  };

  const request = client.request(headers);

  request.on("response", (headers, flags) => {
    console.log("From APN:", headers, flags);
  });
  request.on("data", (data) => {
    console.log(data);
  });

  request.setEncoding("utf8");

  request.write(JSON.stringify(body));
  request.end();
}
