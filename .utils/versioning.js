/* eslint-env es6 */
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('What type of commit did you stage? (bug fix (B) / feature (F)): ', (answer) => {
  const lowerCaseAnswer = answer.toLowerCase();
  if (lowerCaseAnswer === 'b') {
    updateVersion('patch');
  } else if (lowerCaseAnswer === 'f') {
    updateVersion('minor');
  } else {
    console.log('Invalid input. Please provide either "B" or "F".');
  }

  rl.close();
});

function updateVersion(bumpType) {
  const packageJsonPath = 'package.json';

  fs.readFile(packageJsonPath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading ${packageJsonPath}: ${err}`);
      process.exit(1);
    }

    const packageJson = JSON.parse(data);
    const currentVersion = packageJson.version.split('.').map(Number);
    let newVersion;

    // Raise version depending on the type of changes
    if (bumpType === 'patch') {
      newVersion = [currentVersion[0], currentVersion[1], currentVersion[2] + 1];
    } else if (bumpType === 'minor') {
      newVersion = [currentVersion[0], currentVersion[1] + 1, 0];
    }

    if (newVersion[1] === 10) {
      newVersion[0]++;
      newVersion[1] = 0;
    }

    packageJson.version = newVersion.join('.');

    fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8', (err) => {
      if (err) {
        console.error(`Error writing to ${packageJsonPath}: ${err}`);
        process.exit(1);
      }

      console.log(`Version updated to ${packageJson.version} for ${bumpType} commit.`);
    });
  });
}
