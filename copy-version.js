const fs  = require('fs');

let version = require('./package.json').version;

let manifest = require('./manifest.json');
manifest.version = version;
fs.writeFileSync('./manifest.json', JSON.stringify(manifest, null, 2));

