# Prompt Bridge — Google Play Release Handoff

## Android release identity

| Field | Current value | Action before creating the Play Console app |
|---|---|---|
| Store name | Prompt Bridge | Confirm this is the public-facing name. |
| Android package name | `com.app.promptbridge` | Confirm ownership before creating the app. Google Play package names are unique and permanent. |
| Version | `1.0.0` | Use for the first release; increment for every subsequent uploaded release. |
| Distribution format | Android App Bundle (`.aab`) | Upload a release bundle to Play Console rather than an APK for a new app. |
| AI connection | User-managed OpenAI Platform API key | Describe accurately in the Data safety and privacy disclosures; never describe this as a ChatGPT login connection. |

## Standard Play Console release path

1. Create or sign in to the Google Play developer account at [Play Console](https://play.google.com/console).
2. Select **Create app**, then set the default language, the public app name, app type, contact email, policy declarations, and Play App Signing acknowledgement.
3. Create the `com.app.promptbridge` app record only after confirming that package name is intended for permanent use.
4. Complete the App content, Data safety, content-rating, target-audience, privacy-policy, store-listing, and pricing/availability tasks shown by the Play Console dashboard.
5. Create an **internal testing** release first, upload the generated `.aab`, add internal testers, and verify sign-in, API-key connection, assistant requests, and account disconnect behavior.
6. Move through the required testing track and review process before rolling out to production. The Play Console dashboard will show account-specific requirements and blocking errors.

> **Important:** Prompt Bridge sends assistant requests to OpenAI only after a signed-in user provides and validates their own OpenAI Platform API key. Review this data flow carefully when completing the Play Console Data safety form and privacy policy. Do not claim that data is never transmitted or that the app connects to a user's ChatGPT subscription.

## Credential decision

| Goal | Credential required | Where it belongs | Do not use |
|---|---|---|---|
| Manual upload and rollout in Play Console | No API key is required | Google Play Console account and Play App Signing flow | Expo credential, OpenAI key, or service-account key |
| Automated release management through Google Play Developer API | Google Cloud **service-account JSON key** | Server-only secret store or a CI secret manager | Mobile client bundle, app source, or ChatGPT/Expo credential fields |
| In-app assistant | Each user’s OpenAI Platform API key | Prompt Bridge’s authenticated, encrypted per-user connection storage | Global mobile configuration or Expo configuration |

## Optional Google Play Developer API automation

Only set up this connection if you later want server or CI automation for tasks such as creating edits, uploading bundles, managing tracks, or reading release state. It is **not** required to manually publish from Play Console.

1. Create or select a Google Cloud project.
2. Enable the **Google Play Developer API**.
3. Create a Google Cloud service account.
4. In Play Console, go to **Users & permissions**, invite the service-account email, and grant only the release-management permissions it needs.
5. Create a JSON key for that service account and place it only in a server-side secret manager or CI secret store.
6. If Prompt Bridge later receives this integration, use a restricted server endpoint and never send the JSON key to the Expo client.

## Play Store listing starter copy

**Short description**

Build clearer prompts, preserve research context, and carry the next useful question into ChatGPT or your connected OpenAI assistant.

**Full description**

Prompt Bridge is a local-first prompt companion for people who need repeatable language for research, records review, skilled trades, creative work, learning, communication, and everyday decisions. Select a purpose-built prompt, tailor the details, and copy it into ChatGPT. Keep a compact Research Kit with source-spine rows, evidence cards, and a carry-forward brief for the next session.

Users who sign in may connect their own OpenAI Platform API key to use the optional Prompt Bridge assistant for prompt refinement, research planning, communication coaching, and practical task guidance. The user’s key is encrypted server-side and is never displayed back in the app.

## References

1. [Create and set up your app — Google Play Console Help](https://support.google.com/googleplay/android-developer/answer/9859152?hl=en)
2. [Prepare and roll out a release — Google Play Console Help](https://support.google.com/googleplay/android-developer/answer/9859348?hl=en)
3. [Getting Started — Google Play Developer API](https://developers.google.com/android-publisher/getting_started)
