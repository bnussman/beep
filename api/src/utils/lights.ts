import got from "got";

const devices: string[] = [
  "Lamp",
  "Tall Lamp",
  "Short Lamp"
];

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function lights() {
  const { body } = await got.post('http://homebridge.nussman.us/api/auth/login', {
    json: {
      username: 'banks',
      password: 'banks'
    }
  });
  
  const token = JSON.parse(body).access_token as string;

  const { body: accessoriesBody } = await got('http://homebridge.nussman.us/api/accessories', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const accessories = JSON.parse(accessoriesBody);


  for (const accessory of accessories) {
    const { serviceName, uniqueId, values } = accessory;

    if (devices.includes(serviceName)) {
      const accessoryStatus = Boolean(values.On);

      flickerLight(uniqueId, accessoryStatus, token);
    }
  }
}

async function flickerLight(id: string, value: boolean, token: string) {
  setAccessoryStatus(id, !value, token);

  await sleep(2000);

  setAccessoryStatus(id, value, token);
}

function setAccessoryStatus(id: string, value: boolean, token: string) {
  got.put(`http://homebridge.nussman.us/api/accessories/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    json: {
      characteristicType: "On",
      value 
    }
  });
}