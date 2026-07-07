# Tactical Shop — Multi-Agent AI Team on Make.com

A complete 7-agent AI system that runs an online tactical wear shop end-to-end,
orchestrated through Make.com scenarios calling the Anthropic Claude API.

**Business:** Tactical wear & gear e-shop (apparel, boots, plate carriers, belts,
holsters, optics accessories, backpacks, gloves, eyewear). **Strictly no firearms,
ammunition, or regulated weapon parts.** Tbilisi, Georgia. GEL primary currency
(USD/EUR international). Bilingual Georgian/English. Supply from China (Alibaba,
consolidated freight) into a local Tbilisi warehouse.

---

## Platform decisions (assumptions — easy to swap)

The clarifying questions could not be answered interactively (session ran
unattended), so the system is built on these recommended defaults. Every place a
default matters is marked in the docs so you can substitute.

| Decision | Choice | Why |
|---|---|---|
| E-commerce platform | **WooCommerce** | No monthly platform fee; full REST API works on Make free/Core tier; GEL currency + Georgian language via free plugins; Shopify does not support GEL payouts and local Georgian gateways integrate more easily with WordPress plugins. Swap-notes for Shopify are included in build instructions. |
| Payment gateways | **TBC Bank E-Commerce** (GEL, cards, Apple/Google Pay) + **PayPal** (USD/EUR international) | TBC is GEL-native with a WooCommerce plugin; PayPal has a native Make module for reconciliation. |
| Couriers | **Local Tbilisi courier** (same/next-day), **Georgian Post** (regions + intl economy), **DHL Express** (intl premium) | Covers all three delivery tiers. |
| Catalog size | **< 100 SKUs at launch** | Cost estimate sized for this; the design scales to ~500 SKUs on the same patterns (see cost doc). |
| Ad account | Meta Business Suite (Facebook + Instagram) assumed to exist | |
| Claude model | `claude-sonnet-4-6` for agent brains, `claude-haiku-4-5` for the JSON-repair fallback | Sonnet 4.6 = $3/$15 per MTok — right capability/cost point for structured agent decisions. Haiku = $1/$5 for the cheap repair pass. |

## Repository layout

```
tactical-shop-agents/
├── README.md                     ← you are here
├── prompts/
│   ├── 00-shared-conventions.md  ← JSON output contract + bilingual rules (prepended to every agent)
│   ├── 01-ceo-orchestrator.md
│   ├── 02-chief-engineer.md
│   ├── 03-cfo.md
│   ├── 04-accountant.md
│   ├── 05-marketing.md
│   ├── 06-field-operations.md
│   └── 07-admin-supervisor.md
├── blueprints/                   ← importable Make.com scenario blueprints
│   ├── 01-ceo-router.blueprint.json
│   ├── 02-order-to-fulfillment.blueprint.json
│   ├── 03-support-inbox-triage.blueprint.json
│   └── 04-daily-digest.blueprint.json
└── docs/
    ├── 01-architecture.md        ← Mermaid diagram + orchestration spec
    ├── 02-build-instructions.md  ← module-by-module builds for the remaining scenarios
    ├── 03-data-stores.md         ← Data Store schemas
    ├── 04-google-sheets-templates.md
    ├── 05-compliance-guardrails.md
    ├── 06-rollout-plan.md        ← 30-day rollout
    └── 07-cost-estimate.md
```

## Importing the blueprints

1. In Make: **Scenarios → Create a new scenario → ⋯ (More) → Import Blueprint** and
   select a `.blueprint.json` file.
2. After import, Make marks connection-dependent modules with a warning. Re-link
   each to your own connections: **Anthropic Claude** (API key), **Google Sheets**,
   **Telegram Bot**, **Email/SMTP**, **Data Stores** (create them first from
   `docs/03-data-stores.md` — module data-store references must be re-selected).
3. Custom webhooks are re-created on import — copy each new webhook URL into the
   system that calls it (WooCommerce webhook settings, other scenarios, etc.).
4. Set scheduling on the scheduled scenarios (Make stores schedules outside the
   blueprint): Daily digest **08:00 Asia/Tbilisi**, CFO weekly **Mon 09:00**,
   Marketing **daily 10:00**, Accountant reconciliation **daily 23:00**.
5. Follow `docs/06-rollout-plan.md` — start in read-only shadow mode.

## Hard safety rails (enforced in Make, not just prompts)

- No agent can auto-purchase inventory, change bank details, or exceed budget
  limits — these actions are **not wired to any module**; router filters drop them
  and raise a human approval request instead.
- Any Claude response with `needs_approval: true` (or any money-moving / ad-publishing /
  bulk-email action during the first 30 days) pauses at an approval gate:
  Telegram message to the owner with Approve/Reject webhook buttons.
- Numeric caps live in Make filters: `amount_gel > 500` → CEO agent decision;
  ad spend `> 200 GEL/day` → human; refunds `> 200 GEL` → human.
- Every scenario has an error route → `Incidents` sheet → Chief Engineer agent →
  3× exponential-backoff retry (Make's built-in *Break* error handler).
