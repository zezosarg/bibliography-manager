const bibtexParse = require('bibtex-parse');
const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'carnivore.bib'); // Dynamically set the path to the current directory
console.log('filePath', filePath);

const bibFile = fs.readFileSync(filePath, 'utf8');

const bibData = bibtexParse.entries(bibFile);

console.log(bibData);
