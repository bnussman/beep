const fs = require('fs');

let content = '';

console.log(process.env.secrets);

const secrets = JSON.parse(process.env.secrets);

for (const key of secrets) {
  content += `\n  ${key}: "${String(secrets[key])}"`
}

console.log(content);

fs.appendFile(`${__dirname}/templates/configmap.yaml`, content, err => {
  if (err) {
    console.error(err)
    return
  }
});