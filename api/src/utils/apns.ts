import http2 from "http2";
import { importPKCS8, SignJWT } from "jose";

export async function startLiveActivity(deviceToken: string) {
  const privateKey = process.env.APNS_KEY;

  const key = await importPKCS8(privateKey!, "ES256");

  const token = await new SignJWT({ iss: process.env.APNS_TEAM_ID })
    .setProtectedHeader({ alg: "ES256", kid: process.env.APNS_KEY_ID })
    .setIssuedAt()
    .sign(key);

  const client = http2.connect("https://api.push.apple.com");

  const headers = {
    ":method": "POST",
    ":scheme": "https",
    "apns-topic": "app.ridebeep.App.push-type.liveactivity",
    "apns-push-type": "liveactivity",
    ":path": "/3/device/" + deviceToken,
    authorization: `bearer ${token}`,
  };

  const request = client.request(headers);

  request.setEncoding("utf8");

  request.write(
    JSON.stringify({
      aps: {
        event: "start",
        "content-state": {
          title: "Beep with Banks Nussman",
          subtitle: "Your driver is arriving soon",
          progress: 0.5,
          imageName: "taxi",
          dynamicIslandImageName: "taxi",
        },
        timestamp: Date.now(),
        "attributes-type": "LiveActivityAttributes",
        attributes: {
          name: "Test",
          backgroundColor: "19191a",
          titleColor: "FFF",
          subtitleColor: "FFFFFF75",
          progressViewTint: "38ACDD",
          progressViewLabelColor: "FFFFFF",
          timerType: "digital",
          padding: 24,
          imageSize: { width: 32, height: 32 },
          imagePosition: "right",
          contentFit: "contain",
        },
        alert: {
          title: "",
          body: "",
          sound: "default",
        },
      },
    }),
  );

  request.on("response", (headers, flags) => {
    for (const name in headers) {
      console.log(`${name}: ${headers[name]}`);
    }
  });

  let data = "";
  request.on("data", (chunk) => {
    data += chunk;
  });

  request.on("end", () => {
    console.log(`\n${data}`);
    client.close();
  });

  request.end();
}
