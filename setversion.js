/* eslint-env es6 */
const fs = require('fs');

function searchReplaceFile(regexpFind, replace, fileName) {
  var file = fs.createReadStream(fileName, 'utf8');
  var updatedContent = '';

  file.on('data', function(chunk) {
    updatedContent += chunk.toString().replace(regexpFind, replace);
  });

  file.on('end', function() {
    fs.writeFile(fileName, updatedContent, function(err) {
      if (err) {
        return console.log('Trouble with replacing value in .env file\n', err);
      } else {
        console.log('Updated .env file!');
      }
    });
  });
}

buildNumber = process.env.BUILD_NUMBER;
buildEnvVariableRegexp = /\$\{\{\s*BUILD_NUMBER\s*\}\}/g;
searchReplaceFile(buildEnvVariableRegexp, buildNumber, 'src/environments/environment.ts');
searchReplaceFile(buildEnvVariableRegexp, buildNumber, 'src/environments/environment.develop.ts');
searchReplaceFile(buildEnvVariableRegexp, buildNumber, 'src/environments/environment.demo.ts');
searchReplaceFile(buildEnvVariableRegexp, buildNumber, 'src/environments/environment.prod.ts');
