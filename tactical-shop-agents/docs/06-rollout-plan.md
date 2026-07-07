# 30-Day Rollout Plan

Principle: agents earn autonomy gradually. Money, ads, and bulk messaging stay
human-gated for the entire 30 days (and beyond, for money and ads).

## Week 1 — Read-only shadow mode (days 1–7)

**Goal:** verify data flow and decision quality with zero external side effects.

- Set up: Data Stores, both spreadsheets, all connections, import 4 blueprints,
  build scenarios 05–08 + feeders + watchdog + approval gate.
- **Disable every outbound module** (customer email/WhatsApp, WooCommerce
  writes, courier bookings, FB/IG posts): right-click → "Deactivate" or route
  everything into Telegram drafts to the owner instead.
- Agents run on real events; decisions land only in `Decisions` sheet +
  Telegram previews.
- Daily digest live from day 1 (it is read-only by nature).
- **Exit criteria:** ≥ 95% of agent JSON parses without repair; owner agrees
  with ≥ 90% of routing/triage decisions on a 3-day sample; zero prohibited-item
  false negatives on a seeded test feed (add 5 fake weapon-part rows — all must
  be blocked).

## Week 2 — Approval-gated actions (days 8–14)

**Goal:** real actions, every one behind the Telegram gate.

- Re-enable outbound modules but insert the approval gate in front of ALL of
  them (filter: always `needs_approval=true` this week).
- Owner approves/rejects from Telegram; rejections must include a reason —
  these get pasted into the relevant prompt as added few-shot guidance at
  week's end (prompt tuning pass #1).
- Accountant starts writing the real Ledger (low risk, reversible).
- **Exit criteria:** ≥ 85% approval rate on agent proposals; median approval
  latency < 2 h; no incident older than 24 h unresolved.

## Week 3 — Auto low-risk actions (days 15–21)

**Goal:** remove the gate from low-risk, reversible actions.

Auto-approved from now on:
- Admin Supervisor `auto_reply` (pure FAQ / order status).
- Field agent `create_pick_task`, `send_tracking`, courier booking for prepaid
  domestic orders ≤ 300 GEL.
- Chief Engineer `update_stock`, `flag_broken_link`, retry-type fixes.
- Marketing organic `schedule_post` (calendar posts only) and
  `update_calendar`.

Still gated: all prices, all ads, all refunds/RMA resolutions, bulk email,
international/DHL bookings, invoices to companies, `draft_reply` threads.

- Prompt tuning pass #2 from week-2 rejection reasons.
- **Exit criteria:** SLA first-response < 2 h at ≥ 95%; zero wrong-courier
  bookings; zero customer complaints about auto-replies.

## Week 4 — Full operation (days 22–30)

**Goal:** steady state — human oversight only on money and ads.

Auto-approved additionally:
- RMA `exchange` resolutions ≤ 200 GEL.
- Restock/new-drop email campaigns ≤ 200 recipients (owner CC'd).
- CFO `flag_sku_below_floor` handling loop (proposal → CEO agent decision for
  impacts ≤ 500 GEL).

Permanently human-gated (no sunset):
- Any payment, refund execution, or bank matters.
- Ad spend (all of it; > 200 GEL/day needs explicit owner approval per run).
- Price changes (owner one-tap via Telegram, CEO agent pre-validates).
- Inventory purchases and supplier payments.
- Legal/compliance and anything touching the prohibited list.

End-of-month review (day 30): read `Decisions` + `Incidents` + P&L; measure —
orders auto-fulfilled %, support auto-resolved %, approval turnaround, incident
MTTR, Make ops consumed vs plan, Anthropic spend vs estimate. Decide week-5
autonomy expansions explicitly, one action type at a time.

## Rollback rule

Any of: a customer-visible wrong action, a compliance near-miss, or 3 repeated
JSON/logic failures in one scenario → that scenario reverts one week's autonomy
level immediately (flip the `needs_approval` filter back on) until the Chief
Engineer's fix is approved.
