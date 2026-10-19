# Contributing

1. Fork the repo and branch from `develop`.
2. Install dependencies: `pnpm install`.
3. Make your change, then run `pnpm typecheck && pnpm build`.
4. Open a pull request against `develop`.

Releases: bump `version` in `package.json` and update `CHANGELOG.md` on `develop`. Merging `develop` into `main` publishes to npm.

Report security issues as described in [SECURITY.md](SECURITY.md).
