# Make.com Data Store Schemas

Create these in Make (**Data stores → Add data store**) before importing the
blueprints, then re-select them inside each imported module. Suggested max
sizes fit the Core plan's 1 MB default (increase as volume grows).

## 1. Task Queue  (`Task Queue`, ~1 MB)

Key = `task_id`.

| Field | Type | Purpose |
|---|---|---|
| task_id | text | Unique id, e.g. `field-1043-1720344000` (source-orderid-timestamp) |
| from_agent | text | `ceo, chief_engineer, cfo, accountant, marketing, field, admin_supervisor, system, human` |
| to_agent | text | Target agent |
| type | text | Event type (`new_order`, `margin_alert`, `approval_request`, …) |
| payload_json | text | JSON string of the event payload |
| status | text | `received → queued → in_progress → awaiting_approval → done / rejected / failed` |
| priority | number | 1 (urgent) … 5 (low) |
| created_at | date | |
| deadline | date | SLA for the task |

## 2. Orders  (`Orders`)

Key = `order_id`.

| Field | Type | Purpose |
|---|---|---|
| order_id | text | WooCommerce order id |
| customer_name | text | |
| email | text | |
| phone | text | |
| city | text | Courier zone routing |
| country | text | `GE` vs international → courier + VAT zero-rating |
| total_gel | number | |
| payment_status | text | `pending_payment / paid / cod / refunded` |
| fulfillment_status | text | `received → picking → packed → shipped → delivered / on_hold / rma` |
| courier | text | `local / gpost / dhl` |
| tracking_number | text | |
| updated_at | date | |

## 3. SKU / Inventory  (`SKU Inventory`)

Key = `sku`.

| Field | Type | Purpose |
|---|---|---|
| sku | text | e.g. `PC-NAVY-01` |
| title_en | text | |
| title_ka | text | |
| category | text | apparel / boots / carriers / belts / holsters / optics-acc / packs / gloves / eyewear |
| supplier_price_usd | number | Last feed price |
| freight_share_usd | number | Allocated consolidated-freight cost |
| customs_duty_pct | number | 0 / 0.05 / 0.12 by HS code |
| landed_cost_gel | number | CFO-computed |
| retail_price_gel | number | Current store price |
| margin_pct | number | CFO-computed |
| stock_qty | number | Warehouse quantity |
| reorder_point | number | Low-stock alert threshold |
| status | text | `active / clearance / discontinued / blocked_compliance` |
| updated_at | date | |

## 4. Customers / Threads  (`Customers`)

Key = `thread_id` (support threads; customer profile fields denormalized).

| Field | Type | Purpose |
|---|---|---|
| thread_id | text | e.g. `wa-88121`, `em-20260707-3` |
| channel | text | `email / whatsapp / messenger` |
| customer_handle | text | Phone, email or PSID |
| customer_name | text | |
| order_id | text | Linked order if known |
| last_message | text | |
| status | text | `open / awaiting_customer / escalated / closed` |
| category | text | Admin Supervisor triage category |
| received_at | date | |
| sla_deadline | date | received_at + 2 business hours |
| language | text | `ka / en` |

## 5. CEO Memory  (`CEO Memory`)

Key = `okr-YYYY-WW-objective` or `policy-<name>`.

| Field | Type | Purpose |
|---|---|---|
| objective | text | Weekly objective |
| key_result | text | Measurable KR |
| value | text | Current value |
| note | text | Last CEO comment |
| updated_at | date | |

## 6. Incidents (Google Sheet, not a Data Store)

Incidents live in the **Company Brain** spreadsheet (`Incidents` sheet) so the
owner can browse them; columns in `04-google-sheets-templates.md`. Error routes
write there directly; scenario 05 polls `status=open` rows for the Chief
Engineer agent.
