/* eslint-env es6 */
const fs = require('fs');
const { exec } = require('child_process');
const changelogFile = 'CHANGELOG.md';

if (process.argv.length < 3) {
  console.error('Usage: node generateChangelog.js <tag>');
  process.exit(1);
}

const tag = process.argv[2];

exec(`git log ${tag}..HEAD --pretty=format:"- %s" --no-merges`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
  if (stderr) {
    console.error(`Error: ${stderr}`);
    process.exit(1);
  }

  const changelogContent = `\n#Release v${tag}\n\n${stdout}\n`;
  const cleanedChangelog = changelogContent.replace(/#/g, ''); // Remove '#' symbols

  fs.appendFileSync(changelogFile, cleanedChangelog);

  console.log(`Changelog has been updated and saved to ${changelogFile}`);
});
