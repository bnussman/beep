import { appendFile } from "node:fs/promises";

const excludedSecrets = [
  "github_token",
  "KUBE_CONFIG",
];

if (!process.env.secrets) {
  throw new Error("Secrets are not in the environment.");
}

const secrets = JSON.parse(process.env.secrets);

let content = '';

for (const key in secrets) {
  if (excludedSecrets.includes(key)) {
    continue;
  }

  content += `\n  ${key}: "${String(secrets[key].replaceAll(/\n/g, "\\n"))}"`
}

await appendFile(`${__dirname}/templates/configmap.yaml`, content);
