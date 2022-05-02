const fs = require('fs');

let content = '';

const keys = Object.keys(process.env);

for (const key of keys) {
  if (!process.env[key]) {
    continue;
  }

  const value = String(process.env[key]);

  if (value === "true") {
    content += `\n  ${key}: "true"`
  } else if (value === "false") {
    content += `\n  ${key}: "false"`
  } else {
    content += `\n  ${key}: "${value}"`
  }
}

console.log(content);

fs.appendFile(`${__dirname}/templates/configmap.yaml`, content, err => {
  if (err) {
    console.error(err)
    return
  }
});