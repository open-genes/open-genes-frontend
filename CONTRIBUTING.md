# Release cycle

## Before Making a PR
After working on a feature branch or fixing a bug don't forget to set a version and add your changes to a changelog.
This process is automatized, all you need to do is to run:

- `npm run version-and-changelog 2.0.1` — to change the version in package.json and update the changelog
- or `npm run update-changelog 2.0.1` — only update the changelog

Substitute your version instead of the version given in the examples above.
Make sure you specify only the version number without "v" or other prefix.

## Version Numbers

Version numbers follow a pattern known as Semantic Versioning (SemVer), which consists of three components: `major.minor.patch`.

- **Major Version**: This number increases when there are significant changes that might introduce backward-incompatible features or major restructuring. New major versions may require you to update your code to accommodate these changes.

- **Minor Version**: Minor version bumps occur for backward-compatible feature additions or improvements. New features are introduced in a backward-compatible manner, so you can adopt them without breaking your existing code.

- **Patch Version**: Patch versions are for backward-compatible bug fixes or minor enhancements. These updates typically address issues without altering existing features or introducing new ones.

**Examples:**

- Version `1.0.0`: Initial release.
- Version `1.1.0`: Added a new feature without breaking existing functionality.
- Version `1.1.1`: Fixed a bug while maintaining compatibility.

When you're considering which version to use or upgrade to, consult the release notes and changelog provided in the repository to understand the changes introduced in each version. This information will help you make informed decisions about updating your dependencies and codebase.