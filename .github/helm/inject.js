const fs = require('fs');

let content = '';

const keys = Object.keys(process.env);

for (const key of keys) {
  content += `\n  ${key}: ${process.env[key]}`
}

fs.appendFile(`${__dirname}/templates/configmap.yaml`, content, err => {
  if (err) {
    console.error(err)
    return
  }
});