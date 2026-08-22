# Project Recovery Status — Prompt Bridge

| Field | Verified status |
|---|---|
| **PROJECT** | Prompt Bridge (`fear-the-wolves`) |
| **STATUS** | IN PROGRESS |
| **GITHUB REPOSITORY** | https://github.com/Thomascallen16/fear-the-wolves |
| **BRANCH** | `main` |
| **AUDIT BASE COMMIT** | `5785ac1eed38069e3a100ecc74909f77fea373fa` — “Merge remote-tracking branch 'github/main'” |
| **LATEST COMMIT** | Recovery-document preservation commit; verify with `git log -1 --format=%H` after synchronization. |
| **DEPLOYMENT** | Native mobile project; no GitHub Pages deployment applies. GitHub deployment metadata could not be inspected with the connected authorization. |
| **LIVE URL** | Not verified. |

## Working Features

- Local-first prompt catalog, category/search/favorites flows, Prompt Studio, Research Kits, copy-ready instructions, and accessible portrait-first mobile design.
- Server-side encrypted user-managed OpenAI Platform key storage; clients do not receive the stored key.
- Protected assistant endpoints, user-specific credential validation, deterministic prompt/research utility tests, and mobile project configuration.
- Audit verification completed on the audit baseline: `pnpm check`, `pnpm lint`, `pnpm test`, and `pnpm build` all exited successfully. Seven tests passed and one authentication/logout test was skipped.

## Incomplete Features

- The project todo records that a mistakenly supplied Expo credential must be replaced with a valid OpenAI Platform API key before enabling the assistant through the originally intended service configuration.
- Android/iOS package signing, store-console credentials, device testing, privacy disclosures, screenshots, and actual Google Play submission remain external to repository verification.
- Full native-device and production-backend smoke testing was not performed in this source audit.

## Blocked By

- Valid OpenAI Platform API credentials or a user-managed BYOK test account.
- Apple/Google developer-account permissions, signing assets, device access, store metadata, and release approval.
- GitHub API authorization did not permit deployment inspection for this private repository.

## Exact Action Required From Tommy

1. Obtain a valid OpenAI Platform API key—not an Expo project credential—and configure it through the intended secure account/settings flow, or test the existing BYOK feature with a test account.
2. Follow `docs/google-play-release-handoff.md` to prepare Google Play signing, listing, privacy, and release materials.
3. Run the Android build on a physical device, exercise sign-in, assistant credential validation, prompt-generation behavior, and logout.
4. Resolve the one skipped authentication/logout test if it is expected to cover production behavior.

## Environment Variables Required

The managed server uses `DATABASE_URL`, `JWT_SECRET`, `OAUTH_SERVER_URL`, `VITE_APP_ID`, `OWNER_OPEN_ID`, `BUILT_IN_FORGE_API_URL`, and `BUILT_IN_FORGE_API_KEY`. The client references public configuration such as `EXPO_PUBLIC_API_BASE_URL`, `EXPO_PUBLIC_OAUTH_SERVER_URL`, `EXPO_PUBLIC_OAUTH_PORTAL_URL`, `EXPO_PUBLIC_APP_ID`, and `EXPO_PUBLIC_OWNER_OPEN_ID`. Use secret management for sensitive values and never commit credentials.

## Next Command or Task

```bash
pnpm check && pnpm lint && pnpm test && pnpm build
```

Then use a non-production test account to validate the secure OpenAI key connection and assistant flow on a physical Android device.

## Audit Evidence

- Audit executed against a fresh clone at the base commit listed above.
- Dependency installation using the lockfile succeeded.
- Type check, lint, tests, and server build passed locally on 2026-08-22; one test remained intentionally skipped.
- No uncommitted source changes were present before this recovery document was added.
