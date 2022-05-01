const fs = require('fs');

let content = '';

const keys = Object.keys(process.env);

for (const key of keys) {
  content += `  ${key}: ${process.env[key]}\n`
}

fs.appendFile('.gitlab/helm/templates/configmap.yaml', content, err => {
  if (err) {
    console.error(err)
    return
  }
});