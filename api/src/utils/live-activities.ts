import { importPKCS8, SignJWT } from "jose";
import http2 from "http2";
import { beep } from "../../drizzle/schema";
import { APPLE_APN_KEY, APPLE_APN_KEY_ID, APPLE_TEAM_ID } from "./constants";

type Beep = typeof beep.$inferSelect;

export async function sendRiderLiveActivityUpdate(beep: Beep) {
  const devicePath = `/3/device/${beep.rider_live_activity_token}`;

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
      event: "update",
      "content-state": {
        name: "RiderActivity",
        props: JSON.stringify({
          status: beep.status,
          name: `Banks OMG`,
          etaMinutes: 0,
        }),
      },
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

  request.setEncoding("utf8");

  request.write(JSON.stringify(body));
  request.end();
}
