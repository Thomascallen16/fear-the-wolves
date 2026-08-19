# Prompt Bridge — Mobile Interface Design

## Product premise

Prompt Bridge is a **local-first mobile companion for ChatGPT users** who need reliable prompt workflows for public-records research, evidence review, context management, creative work, skilled trades, education, and clear communication. The app does not claim to provide special access to records or ChatGPT. Instead, it helps the user prepare structured prompts, preserve their research state, copy a prompt, and hand it off to the ChatGPT app or web experience.

## Design direction

The interface is designed for **one-handed portrait use at 9:16**. It follows iOS conventions: a large title and short context at the top of each primary screen, native-feeling list rows, clear segmented choices, restrained rounded cards, generous 16–20 pt touch targets, and primary actions positioned within easy thumb reach. The visual character is a calm field notebook rather than a generic AI dashboard.

### Color choices

| Role | Color | Purpose |
|---|---|---|
| Midnight ink | `#10233E` | Primary text, tab-bar emphasis, trusted research tone |
| Harbor blue | `#146C94` | Primary action, active state, links, and progress |
| Paper | `#F7F5F0` | Warm neutral screen background |
| Card white | `#FFFFFF` | Elevated prompt and source cards |
| Apricot marker | `#F3A75A` | Attention, saved context, and highlighted research status |
| Moss | `#3F7F69` | Verified or completed states |
| Slate | `#687281` | Secondary text, metadata, and dividers |

## Screen list

| Screen | Primary content and functionality |
|---|---|
| Today | A calm launchpad with the current research kit, recently used prompts, a prominent “Build a prompt” action, and a compact research-state check. |
| Library | Searchable prompt cards grouped into Research, Records, Communication, Context, Art & Design, Trades, Judicial Review, Education, and Everyday. Users can favorite a prompt and open its detail. |
| Prompt Studio | A focused editor that shows the selected prompt, asks for the variables it needs, previews the filled prompt, and provides Copy and Open ChatGPT handoff actions. |
| Research Kit | A local project workspace containing objective, active question, source spine rows, evidence cards, and a generated carry-forward brief. |
| Settings | Copy-ready Custom Instructions, Memory entries, and behavioral defaults. Each block can be copied independently. |

## Key user flows

1. **Find and use a prompt:** The user opens Library → filters to Records or Research → opens a prompt → fills optional fields in Prompt Studio → taps Copy → chooses “Open ChatGPT” or returns to their preferred ChatGPT client.

2. **Create a research handoff:** The user opens Research Kit → records an objective and one active question → adds concise source entries → taps “Create handoff” → copies the carry-forward packet into a new ChatGPT session.

3. **Improve a message:** The user opens Today or Library → selects a Communication prompt → pastes rough text and audience/tone → copies the edited prompt → uses it in ChatGPT.

4. **Set reliable defaults:** The user opens Settings → selects the Custom Instructions or Memory section → copies the relevant block → pastes it into the corresponding ChatGPT setting.

## Local data model

| Entity | Key fields | Persistence |
|---|---|---|
| PromptTemplate | `id`, `title`, `category`, `summary`, `prompt`, `variables`, `safetyNote`, `favorite` | Bundled catalog plus AsyncStorage favorites |
| ResearchKit | `id`, `name`, `objective`, `activeQuestion`, `updatedAt` | AsyncStorage |
| SourceSpineEntry | `id`, `sourceId`, `issuer`, `recordDate`, `type`, `url`, `pages`, `relevance` | Nested in ResearchKit |
| EvidenceCard | `id`, `sourceId`, `page`, `quote`, `label`, `status` | Nested in ResearchKit |
| AppPreferences | `lastKitId`, `favoritePromptIds`, `onboardingSeen` | AsyncStorage |

## Accessibility and interaction rules

Every touch target is at least 44 pt tall. Cards use text labels in addition to color. Primary actions use short verbs: **Build**, **Copy**, **Open**, **Save**, and **Create handoff**. Content uses short paragraphs and compact metadata, with the copyable text always placed in a selectable field or modal rather than hidden behind an icon. Actions that write locally display a brief confirmation state, and the app avoids implying that it has sent data to ChatGPT.
