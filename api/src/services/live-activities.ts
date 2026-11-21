import { importPKCS8, SignJWT } from "jose";
import { APPLE_APN_KEY, APPLE_APN_KEY_ID, APPLE_TEAM_ID } from "../utilities/constants";

const APNS_URL = "https://api.push.apple.com/3/device";
const APNS_TOPIC = "app.ridebeep.App.push-type.liveactivity";

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

async function getAuthToken() {
  if (!APPLE_APN_KEY || !APPLE_TEAM_ID) {
    throw new Error("Apple Keys not setup in the Beep API.");
  }

  const privateKey = await importPKCS8(APPLE_APN_KEY, "ES256");

  return new SignJWT()
    .setIssuer(APPLE_TEAM_ID)
    .setIssuedAt()
    .setProtectedHeader({ alg: "ES256", kid: APPLE_APN_KEY_ID })
    .sign(privateKey);
}

function getPayload(options: ActivityUpdate) {
  const now = Date.now();

  if (options.action === "end") {
    return {
      aps: {
        timestamp: now,
        event: "end",
        "content-state": {},
        "dismissal-date": now / 1000,
        sound: "default",
      },
    };
  }

  return {
    aps: {
      timestamp: now,
      event: "update",
      "content-state": {
        name: options.name,
        props: JSON.stringify(options.props),
      },
      alert: options.alert,
      sound: "default",
    },
  };
}

export async function updateLiveActivity(
  deviceToken: string,
  options: ActivityUpdate,
) {
  const token = await getAuthToken();

  const response = await fetch(`${APNS_URL}/${deviceToken}`, {
    method: "POST",
    protocol: "http2", // APNs only speaks HTTP/2
    headers: {
      authorization: `bearer ${token}`,
      "apns-push-type": "liveactivity",
      "apns-topic": APNS_TOPIC,
      "apns-priority": "10",
    },
    body: JSON.stringify(getPayload(options)),
  });

  if (!response.ok) {
    console.error("APNs live activity update failed:", response.status, await response.text());
  }
}
