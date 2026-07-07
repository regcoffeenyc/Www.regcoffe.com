# Cost Estimate (monthly, steady state)

Sized for the launch assumption: **< 100 SKUs, ~150 orders/month, ~300 support
messages/month**. Scaling notes at the bottom.

## Make.com operations

| Scenario | Runs/mo | Ops/run (avg) | Ops/mo |
|---|---|---|---|
| 01 CEO Router (all events + escalations) | ~600 | 7 | 4,200 → batched to ~2,500* |
| 02 Order → Fulfillment | 150 orders × ~2 events | 8 | 2,400 |
| 03 Support Triage (+3 feeders) | 300 msgs | 8 (+2 feeder) | 3,000 |
| 04 Daily Digest | 30 | 10 | 300 |
| 05 Maintenance sync (100 SKUs, changed-rows only) | 30 | ~20 | 600 |
| 05b Incidents/health (48/day polls, mostly empty) | 1,440 | 1–2 | 2,000 |
| 06 CFO Weekly | 4–5 | 25 | 120 |
| 07 Nightly Reconciliation | 30 | 20 | 600 |
| 08 Marketing Daily | 30 | 12 | 360 |
| SLA watchdog (15-min, business hours) | ~700 | 1–2 | 1,100 |
| Approval gate + misc | — | — | 500 |
| **Total** | | | **~13,500 ops/mo** |

\* Route only decision-needing events through the CEO; pure logging skips the
Claude call (filter), which is what brings the router down to ~2,500.

**Plan:** **Make Core, 20,000 ops tier** ≈ **$18–19/mo** (annual billing).
The 10k Core tier ($10.59/mo) works only if you thin the watchdog/health polls
(30-min cadence → ~11k total). **Pro is NOT required** for anything in this
design — Data stores, custom webhooks, error handlers, and scheduling are all
Core features. Pro (~$34/mo at 20k ops) becomes worth it later for custom
variables, full-text execution log search, and priority execution.

## Anthropic API tokens

Per agent call: system prompt ~2.5k tokens + payload ~0.8k = ~3.3k input;
~0.4k output. Model `claude-sonnet-4-6`: input $3/MTok, output $15/MTok
→ **≈ $0.016/call**.

| Caller | Calls/mo |
|---|---|
| CEO router (decision-needing events) | 350 |
| Field agent (order events) | 300 |
| Admin Supervisor (support msgs) | 300 |
| Daily digest (bigger payload ×3) | 30 → ≈ 90 call-equivalents |
| Chief Engineer (sync deltas + incidents) | 250 |
| CFO + Accountant + Marketing (batch runs) | 100 |
| JSON repair (Haiku, ~3% of calls) | 40 (≈ $0.004 ea) |
| **Total** | **~1,400 calls/mo** |

**≈ $23–30/month.** Add **prompt caching** on the system-prompt block
(`cache_control: ephemeral` — supported via HTTP module if the Make app
doesn't expose it) and repeat input drops ~90%, bringing this toward
**$10–15/mo**. Budget **$30/mo** to be safe.

## Other

| Item | $/mo |
|---|---|
| Make Core 20k | 19 |
| Anthropic API | 30 |
| WooCommerce hosting (decent VPS/managed WP) | 10–25 |
| WhatsApp Business Cloud (service conversations mostly free tier) | 0–10 |
| Google Workspace (optional; free Gmail/Sheets works) | 0–7 |
| **Total infrastructure** | **≈ $60–90/mo** |

(Excludes ad spend, courier fees, and payment-gateway percentages —
TBC ≈ 2–2.5%, PayPal ≈ 3.4–4.4% + fixed.)

## Scaling notes

- **500 SKUs / 500 orders / 1,000 support msgs per month** → ~35–40k Make ops
  (Core 40k tier ≈ $35/mo) and ~$70–90 Anthropic (≈ $35 with caching). The
  architecture is unchanged; only tier upgrades.
- Biggest cost lever: keep FAQ auto-replies on the cheap path (consider moving
  Admin Supervisor's pure-FAQ classification to `claude-haiku-4-5` at 1/3 the
  price once week-3 quality data supports it).
- Watch Make ops in **Organization → Usage**; set an alert at 80% so scenarios
  don't silently stop mid-month.
