/* eslint-env es6 */
const fs = require('fs');
const { exec } = require('child_process');

if (process.argv.length < 3) {
  console.error('Usage: node update-version-and-changelog.js <version>');
  process.exit(1);
}

const newVersion = process.argv[2];

// Read package.json and update the version field
fs.readFile('package.json', 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading package.json: ${err}`);
    process.exit(1);
  }

  const packageJson = JSON.parse(data);
  packageJson.version = newVersion;

  // Write the updated package.json back to the file
  fs.writeFile('package.json', JSON.stringify(packageJson, null, 2), 'utf8', (err) => {
    if (err) {
      console.error(`Error writing to package.json: ${err}`);
      process.exit(1);
    }

    // Run the generate-changelog script with the new version
    exec(`node generate-changelog.js ${newVersion}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error running generate-changelog.js: ${error.message}`);
        process.exit(1);
      }
      if (stderr) {
        console.error(`Error: ${stderr}`);
        process.exit(1);
      }

      console.log(stdout);
      console.log('Version updated in package.json and changelog generated successfully.');
    });
  });
});
