/* eslint-env es6 */
const fs = require('fs');
const version = require('./package.json').version;
const buildNumber = fs.readFileSync('.env', 'utf8');

const build = buildNumber.replace(/(\r\n|\n|\r)/gm, '').replace(/,/gm);

const targetFiles = [
  'src/environments/environment.ts',
  'src/environments/environment.develop.ts',
  'src/environments/environment.demo.ts',
  'src/environments/environment.prod.ts'
];
const replacements = new Map([
  ['{{VERSION}}', version],
  ['{{BUILD_NUMBER}}', build],
]);

function searchReplaceFile(comment, replacementsMap, fileName) {
  const targetFile = fs.createReadStream(fileName, 'utf8');
  let updatedContent = '';

  targetFile.on('data', function(chunk) {
    updatedContent = chunk.toString().replace(/{{[^}]+}}/g, function(m) {
      return replacementsMap.get(m) || m;
    });
  });

  targetFile.on('end', function() {
    fs.writeFile(fileName, updatedContent, function(err) {
      if (err) {
        return console.log(`Trouble with replacing ${comment} in ${fileName}\n`, err);
      } else {
        console.log(`Successfully replaced ${comment} in ${fileName}`);
      }
    });
  });
}

for (const file of targetFiles) {
  console.log(version);
  searchReplaceFile('build number', replacements, file);
}