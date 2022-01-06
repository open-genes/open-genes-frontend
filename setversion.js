/* eslint-env es6 */
const fs = require('fs');

function searchReplaceFile(regexpFind, replace, fileName) {
  const targetFile = fs.createReadStream(fileName, 'utf8');
  let updatedContent = '';

  targetFile.on('data', function(chunk) {
    updatedContent += chunk.toString().replace(regexpFind, replace);
  });

  targetFile.on('end', function() {
    fs.writeFile(fileName, updatedContent, function(err) {
      if (err) {
        return console.log('Trouble with replacing value in .env file\n', err);
      } else {
        console.log(`Updated .env file ${fileName}`);
      }
    });
  });
}

buildNumber = fs.readFileSync('.env', 'utf8');
console.log(buildNumber);
buildEnvVariableRegexp = /\$\{\{\s*BUILD_NUMBER\s*\}\}/g;
searchReplaceFile(buildEnvVariableRegexp, buildNumber, 'src/environments/environment.ts');
searchReplaceFile(buildEnvVariableRegexp, buildNumber, 'src/environments/environment.develop.ts');
searchReplaceFile(buildEnvVariableRegexp, buildNumber, 'src/environments/environment.demo.ts');
searchReplaceFile(buildEnvVariableRegexp, buildNumber, 'src/environments/environment.prod.ts');
