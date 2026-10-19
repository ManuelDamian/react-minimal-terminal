# Changelog

## 0.1.3

### Fixed
- Drop the unused `react-dom` peer dependency; the library only imports `react`.
- Raise the `react` peer range to `>=17.0.0`, which the `react/jsx-runtime` build already required.

## 0.1.2

### Security
- Publish to npm with provenance (`npm publish --provenance`) via npm Trusted Publishing (OIDC); no long-lived token.
- Pin GitHub Actions to commit SHAs and install with a frozen lockfile.
- Add Dependabot for npm and GitHub Actions.

### Fixed
- `exports` now lists `types` first and no longer advertises a CommonJS entry that pointed to an ES module.
- Stop publishing the demo entry's `main.d.ts`.
- Emit the stylesheet as `dist/style.css`, matching the `exports` map.

### Added
- `repository`, `homepage`, `bugs`, `keywords`, `sideEffects` and `engines` metadata.
- `typecheck` script and CI workflow for `develop` and pull requests.
- `SECURITY.md`, `CONTRIBUTING.md` and this changelog.
