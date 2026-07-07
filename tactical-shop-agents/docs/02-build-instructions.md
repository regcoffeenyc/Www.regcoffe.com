# Module-by-Module Build Instructions (remaining scenarios)

The four core scenarios import from `blueprints/`. Build the rest by hand as
specified below. Conventions used everywhere:

- **Claude module** = app *Anthropic Claude* → *Create a Message*, connection =
  your Anthropic API key, model `claude-sonnet-4-6`, max tokens 1500, System =
  `prompts/00-shared-conventions.md` + the agent prompt, User message = the JSON
  task envelope.
- **Parse module** = *JSON → Parse JSON* on `{{body.content[].text}}` of the
  Claude module, with the error route: *Anthropic Claude (claude-haiku-4-5,
  "repair this JSON")* → *Parse JSON* → *Resume*.
- **Error handler** on every Claude/HTTP module = right-click → *Add error
  handler* → *Google Sheets: Add a Row* (Company Brain → Incidents) followed by
  **Break** (retries 3, interval 1 min, exponential ✓).

---

## 05 — Store Maintenance (Chief Engineer)

Two triggers in one scenario group.

### 05a — Daily supplier/price/inventory sync (schedule 06:00 Tbilisi)

| # | Module | Setup |
|---|---|---|
| 1 | **Google Sheets → Search Rows** | Spreadsheet `Supplier Feed` (or **HTTP → Get a File** + **CSV → Parse CSV** if the supplier sends CSV by URL/email). One bundle per SKU row. |
| 2 | **Data store → Get a Record** | Store `SKU Inventory`, key `{{1.sku}}`. Continue on "not found" (new SKU). |
| 3 | **Router** | |
| 3a | *Filter:* `2.supplier_price_usd ≠ 1.supplier_price_usd` OR record missing → **Anthropic Claude** (Chief Engineer prompt) with type `price_sync` payload | Price change or new product → agent decides `create_product` / `propose_price_update`. |
| 3b | *Filter:* `1.stock_qty ≠ 2.stock_qty` → **HTTP → Make a Request** `PUT {{store_url}}/wp-json/wc/v3/products/{{2.woo_id}}` body `{"stock_quantity": {{1.stock_qty}}}` (Basic auth: WooCommerce consumer key/secret) | Direct stock sync — no agent needed. Then **Data store → Add/Edit** to update `stock_qty`. |
| 4 | After 3a: **Parse JSON** → **Router** | |
| 4a | `action=create_product` → **HTTP** `POST /wp-json/wc/v3/products` with title/description (both languages via WPML/Polylang fields), price, images, category → **Data store → Add/Edit a Record** (`SKU Inventory`) | |
| 4b | `action=propose_price_update` → **HTTP POST** to CEO Router webhook (`type: margin_alert`, priority 2) | CFO validates margin before any price changes. |
| 4c | `action=raise_incident` or prohibited-item guard → **Google Sheets → Add a Row** (Incidents) + **Telegram** to owner if severity=high | |
| 5 | *Filter:* `1.stock_qty ≤ 2.reorder_point` → **HTTP POST** CEO Router (`type: inventory_low`) | Reorder is always a human decision. |

### 05b — Incident consumer + webhook health (schedule every 30 min)

| # | Module | Setup |
|---|---|---|
| 1 | **Google Sheets → Search Rows** | Incidents sheet, `status = open`. |
| 2 | **Anthropic Claude** (Chief Engineer prompt) | type `scenario_error`, payload = incident row. |
| 3 | **Parse JSON** → **Router** | `fix_type=retry` → **Make API: Run scenario** (HTTP POST `https://eu1.make.com/api/v2/scenarios/{id}/run`, token auth) • `fix_type=remap/patch_script` → **Telegram** to owner with `patch_code` for review • repeats ≥3 → **HTTP POST** CEO Router (`raise_incident` high). |
| 4 | **Google Sheets → Update a Row** | Incident `status = triaged / fixed`. |
| 5 | **HTTP → Make a Request** `GET {{store_url}}/wp-json` + key pages | Health check; add error handler → Incidents row. A **Get** on each scenario webhook URL with a `ping=1` test payload covers webhook health. |

Broken-link check: monthly **HTTP → Get a File** of the WooCommerce sitemap →
**XML → Parse** → iterate URLs → **HTTP GET** (error handler ignores) → non-200
→ `flag_broken_link` row in Incidents.

---

## 06 — CFO Weekly (schedule Monday 09:00 Tbilisi)

| # | Module | Setup |
|---|---|---|
| 1 | **HTTP → Get** `https://nbg.gov.ge/gw/api/ct/monetarypolicy/currencies/en/json` | NBG USD/EUR→GEL rates. |
| 2 | **Data store → Search Records** | `Orders`, `updated_at` ≥ now−7d. Then **Array aggregator**. |
| 3 | **Data store → Search Records** | `SKU Inventory` (all active). **Array aggregator**. |
| 4 | **Google Sheets → Search Rows** | Ledger sheet, last 7 days (refunds, fees, ad spend rows). **Array aggregator**. |
| 5 | **Anthropic Claude** (CFO prompt) | type `weekly_pnl` + `margin_audit` combined payload: orders, SKU costs, ledger rows, `usd_gel_rate` from module 1. |
| 6 | **Parse JSON** → **Router** | |
| 6a | `action=publish_pnl` → **Google Sheets → Add a Row** (P&L snapshot sheet) | |
| 6b | `action=flag_sku_below_floor` (iterate) → **HTTP POST** CEO Router (`type: margin_alert`) | |
| 6c | `action=set_price` → **HTTP POST** CEO Router (`type: approval_request`) — never straight to WooCommerce | Hard rule: price changes only via approval gate. |
| 6d | `action=cash_forecast` with `alert` set → **Telegram** owner immediately | |

Webhook variant: the same scenario has a custom webhook trigger for ad-hoc
`reprice_sku` tasks dispatched by the CEO router (filter on `type`).

---

## 07 — Nightly Reconciliation (Accountant, schedule 23:00 Tbilisi)

| # | Module | Setup |
|---|---|---|
| 1 | **PayPal → Search Transactions** (native module) | Last 24 h. |
| 2 | **Email → Search Emails** or **HTTP** | TBC statement: TBC e-commerce merchant portal export email or API if enabled; parse rows with **Text parser** / **CSV Parse**. |
| 3 | **Data store → Search Records** | `Orders` with `payment_status = pending_payment` + last 24 h paid orders. **Aggregators** on 1–3. |
| 4 | **Anthropic Claude** (Accountant prompt) | type `reconcile_batch` payload: unmatched payments, open orders, NBG rates (add module 0 = HTTP NBG call if USD/EUR present). |
| 5 | **Parse JSON** → iterate `actions` via **Router** | |
| 5a | `record_ledger_entry` → **Google Sheets → Add a Row** (Ledger) | |
| 5b | `match_payment` → **Data store → Add/Edit** (`Orders`: payment_status=paid) + Ledger row | |
| 5c | `flag_unmatched` → **Google Sheets → Add a Row** (Ledger sheet, `Unmatched` tab) + include in digest | |
| 5d | `issue_invoice` → **Google Docs → Create a Document from Template** (bilingual invoice template, fields from parameters) → **Email → Send** to customer | Invoice numbering: keep `next_invoice_number` in a 1-row Data Store, increment with Add/Edit. |
| 5e | fraud flag / `escalate_to=human` → **Telegram** owner | |

Monthly (1st, 09:00): same scenario with a filter branch `type=vat_export_run` —
**Google Sheets → Search Rows** (Ledger, previous month) → Claude `vat_export` →
**Add a Row** to `VAT Export` sheet (rs.ge-ready totals) → **Email** owner.

---

## 08 — Marketing Daily (schedule 10:00 Tbilisi)

| # | Module | Setup |
|---|---|---|
| 1 | **Google Sheets → Search Rows** | Company Brain → `Content Calendar`, rows for today, `status=planned`. |
| 2 | **Data store → Search Records** | `SKU Inventory`: recent `status=active` additions + restocks (updated_at last 48 h, qty went 0→>0 flag column). |
| 3 | **WooCommerce (HTTP) → GET** `/wp-json/wc/v3/orders?status=pending` older than 3 h with cart data, or use a cart-abandonment plugin webhook | Abandoned carts input. |
| 4 | **Anthropic Claude** (Marketing prompt) | type `content_run` payload with modules 1–3. |
| 5 | **Parse JSON** → **Router** | |
| 5a | `schedule_post` + `needs_approval=false` (organic, after week 3) → **Facebook Pages → Create a Post** / **Instagram for Business → Create a Photo Post** with `publish_at` | During weeks 1–2: replace with Telegram draft to owner. |
| 5b | `propose_ad` → ALWAYS **HTTP POST** CEO Router (`type: approval_request`, include `daily_budget_gel`) | Filter hard-cap: if `daily_budget_gel > 200` set flag `human_required=true`. Ads are created manually in Meta Ads Manager after approval during the first 60 days; later optionally via Facebook Custom Audiences/Marketing API modules. |
| 5c | `send_email_campaign` → *Filter:* `recipient_count ≤ 20` → **Email → Send** loop; `> 20` → approval gate first | |
| 5d | `update_calendar` → **Google Sheets → Update a Row** | |
| 5e | `weekly_report` (Mondays) → **Google Sheets → Add a Row** (Company Brain → `Marketing KPIs`) + **HTTP POST** CEO Router | |

Campaign results input: **Facebook Insights/Ads → Get Insights** (or CSV export)
weekly, posted to this scenario's webhook as `campaign_result`.

---

## Feeder scenarios for the unified support inbox (scenario 03)

Three 2-module scenarios, each normalizing into the shape scenario 03 expects:

1. **Email:** *Email → Watch Emails* (support@ mailbox) → *HTTP POST* to
   scenario 03 webhook: `{channel:"email", customer:{handle: from, email: from},
   message_text: text, thread_id: "em-" + messageId, received_at: date}`.
2. **WhatsApp:** *WhatsApp Business Cloud → Watch Events* (messages) → *HTTP
   POST*: `{channel:"whatsapp", customer:{handle: sender}, message_text: body,
   thread_id: "wa-" + sender, received_at: timestamp}`.
3. **Messenger:** *Facebook Messenger → Watch Messages* → *HTTP POST*:
   `{channel:"messenger", customer:{handle: senderId}, ...}`.

## SLA watchdog (schedule: every 15 min, 10:00–19:00 Mon–Sat)

*Data store → Search Records* (`Customers`: `status=open` AND `sla_deadline` <
now+30min) → *Telegram → Send a Message* to owner/support person per thread
(`sla_alert`). Over-deadline threads also POST to CEO Router as `type:
support_message`, priority 1.

## Approval-gate scenario (webhook)

*Custom webhook* (receives `?task_id=&decision=`) → *Data store → Add/Edit*
(`Task Queue`: status = approved/rejected) → *HTTP POST* CEO Router
(`type: approval_decision`, payload `{task_id, decision}`) → *Webhook response*
("✅ Recorded, you can close this tab."). The CEO router resumes the original
action only on `decision=approve`.

## Shopify swap notes

If you later choose Shopify: triggers become *Shopify → Watch Orders /
Watch Abandoned Checkouts*; product/stock writes use *Shopify → Create/Update
Product* and *Update Inventory Level*; everything else (agents, stores, gates)
is unchanged. Budget the $29+/mo Shopify fee and note GEL is display-only there.
